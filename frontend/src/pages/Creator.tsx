// src/pages/Creator.tsx
import { useEffect, useRef, useState } from 'react';
import { Star, Eye, TrendingUp, BookOpen, Calendar, Award, Users, MessageCircle, ArrowLeft, Dumbbell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import PlanCardNew from "@/components/PlanCardNew"
import type { PlanPreview } from '@shared/types/plan';
import type { CreatorPreviewDTO } from '@shared/types/creator';
import type { CreatorPageReviewDTO } from '@shared/types/review';
import { SiInstagram } from 'react-icons/si';
import { RatingBreakdownCard } from '@frontend/components/RatingBreakdownCard';

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────
const Creator = ({ subdomain }: { subdomain: string | null }) => {
  const [plans, setPlans] = useState<PlanPreview[]>([]);
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<CreatorPageReviewDTO[] | null>(null);

  const plansRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  // ───────────── Fetch creator ─────────────
  useEffect(() => {
    if (!subdomain) return;

    const abort = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/creators/by-subdomain/${subdomain}`, {
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const c: CreatorPreviewDTO = await res.json();
        setCreator(c);

        // Fetch plans for this creator
        const planRes = await fetch(`/api/v1/creators/by-subdomain/${subdomain}/plans`, {
          signal: abort.signal,
        });
        if (!planRes.ok)
          throw new Error(`Plans fetch failed: ${planRes.status}`);
        const plansData: PlanPreview[] = await planRes.json();
        setPlans(plansData);

        const reviewRes = await fetch(`/api/v1/creators/${c.id}/reviews`, {
          signal: abort.signal,
        });
        if (!reviewRes.ok)
          throw new Error(`Reviews fetch failed: ${reviewRes.status}`);
        const reviewData: CreatorPageReviewDTO[] = await reviewRes.json();
        setReviews(reviewData);

      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message ?? 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [subdomain]);



  // ───────────── Render logic ─────────────
  if (loading)
    return (
      <div className="min-h-screen-navbar flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  if (!creator)
    return (
      <div className="min-h-screen-navbar flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Creator not found</h2>
          <p className="text-muted-foreground">
            The creator you’re looking for doesn’t exist.
          </p>
        </div>
      </div>
    );


  if (error || !reviews)
    return (
      <div className="min-h-screen-navbar flex items-center justify-center bg-background">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );

  const getRatingBreakdown = () => {
    const breakdown = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.rating === stars).length
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
      return { stars, count, percentage }
    })
    return breakdown
  }

  const handleBack = () => {
    window.history.back()
  }

  const scrollToRefWithOffset = (
    ref: React.RefObject<HTMLElement | null>,
    offset = 80
  ) => {
    const element = ref.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const scrollToPlans = () => {
    scrollToRefWithOffset(plansRef, 80);
  };

  const scrollToReviews = () => {
    scrollToRefWithOffset(reviewsRef, 80);
  };

  const handleInstagramClick = () => {
    if (creator.instagram) {
      window.open(`https://instagram.com/${creator.instagram}`, "_blank")
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }
  //TODO: PUT INSTAGRAM ICON. 

  // ───────────── UI ─────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="relative h-52 md:h-80 lg:h-88 [@media(min-width:1600px)]:h-[25rem] overflow-hidden">
          <img
            src={
              creator.coverUrl || '/default.jpg' 
            }
            alt={`${creator.username} cover`}
            width={1200}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Back Button */}
          <Button variant="ghost" className="absolute top-6 left-6 text-white hover:bg-white/20" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Profile Views Badge */}
          <Badge className="absolute top-6 right-6 bg-black/50 text-white border-0">
            <Eye className="h-4 w-4 mr-2" />
            {formatNumber(creator.profileViews)} views
          </Badge>
        </div>

        {/* Creator Info Section - Below Image */}
        <div className="bg-background border-b">
          <div className="container mx-auto p-4 md:p-8">
            {/* Mobile Layout */}
            <div className="flex flex-col md:hidden gap-4">
              <div className="flex items-center gap-4 -mt-12">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl bg-background">
                  <AvatarImage src={creator.avatarUrl} alt={creator.username} />
                  <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                    {creator.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-12">
                  <div className='flex gap-3'>
                    <h1 className="text-2xl font-bold mb-1">{creator.username}</h1>
                    {creator.instagram && (
                      <button
                        onClick={handleInstagramClick}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Instagram"
                      >
                        <SiInstagram className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{creator.subdomain}.trainwithx.com</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{creator.yearsXP} years experience</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Joined {(new Date(creator.joinedAt)).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{Number(creator.avgRating).toFixed(1)}</span>
                  <span>({creator.noReviews} reviews)</span>
                </div>
              </div>

              <div className="flex gap-2">
                {/* {creator.instagram && (
                  <Button onClick={handleInstagramClick} variant="outline" className="flex-1 bg-transparent" size="sm">
                    <SiInstagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                )} */}

                <Button onClick={scrollToPlans} className="bg-primary hover:bg-primary/90 flex-1" size="sm">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  View Plans
                </Button>

                <Button onClick={scrollToReviews} variant="outline" size="sm" className="flex-1">
                  <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                  View Reviews
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex items-end gap-6 -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl bg-background">
                  <AvatarImage src={creator.avatarUrl} alt={creator.username} />
                  <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                    {creator.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 pt-16">
                  <div className="flex gap-3">
                    <h1 className="text-4xl font-bold mb-2">{creator.username}</h1>
                    {creator.instagram && (
                      <button
                        onClick={handleInstagramClick}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Instagram"
                      >
                        <SiInstagram className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xl text-muted-foreground mb-3">{creator.subdomain}.trainwithx.com</p>
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{creator.yearsXP} years experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Joined {(new Date(creator.joinedAt)).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{Number(creator.avgRating).toFixed(1)}</span>
                      <span>({creator.noReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-3">
                <Button onClick={scrollToPlans} className="min-h-10 bg-primary hover:bg-primary/90 flex-1" size="sm">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  View Plans
                </Button>

                <Button onClick={scrollToReviews} variant="outline" size="sm" className="min-h-10 flex-1">
                  <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                  View Reviews
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-8">
        {/* About and Stats - Side by Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  About {creator.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg">{creator.bio}</p>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {creator.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {creator.certifications.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {creator.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {creator.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Achievements</h4>
                    <div className="space-y-2">
                      {creator.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Creator Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-bold text-2xl">{formatNumber(creator.totalSales)}</div>
                    <div className="text-sm text-muted-foreground">Total Sales</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-bold text-2xl">{creator.plansCount}</div>
                    <div className="text-sm text-muted-foreground">Plans Created</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <div className="font-bold text-2xl">{Number(creator.avgRating).toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Summary */}
            <RatingBreakdownCard reviews={reviews} />
          </div>
        </div>

        {/* Plans Section - Full Width */}
        <Card ref={plansRef} className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Training Plans ({plans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plans.length < 3 ? (
              <div className="flex justify-center gap-6 flex-wrap">
                {plans.map((plan) => (
                  <PlanCardNew key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <PlanCardNew key={plan.id} plan={plan} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile Stats - Shown only on mobile, below plans */}
        <div className="lg:hidden mt-8 space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Creator Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">{formatNumber(creator.totalSales)}</div>
                  <div className="text-sm text-muted-foreground">Total Sales</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">{creator.plansCount}</div>
                  <div className="text-sm text-muted-foreground">Plans Created</div>
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="font-bold text-2xl">{Number(creator.avgRating).toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({creator.noReviews})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRatingBreakdown().map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12">{stars} Stars</span>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-8">({count})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card ref={reviewsRef} className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.userAvatar} alt={review.userUsername} />
                      <AvatarFallback>
                        {review.userUsername
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.userUsername}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Reviewed "{review.planTitle}"
                            <span className="hidden sm:inline"> · </span>
                            <span className="block sm:inline">  {new Date(review.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-muted-foreground"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet. Be the first to leave a review!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};


export default Creator;
