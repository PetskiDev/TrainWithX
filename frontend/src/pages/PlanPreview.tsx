import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Play,
  Clock,
  Star,
  CheckCircle,
  Shield,
  Download,
} from 'lucide-react';
import type { PlanPaidPreveiw } from '@trainwithx/shared';
import type { CreatorPreviewDTO } from '@trainwithx/shared';
import BuyButton from '@frontend/components/BuyButton';
import type { CreatorPageReviewDTO } from '@trainwithx/shared';
import { RatingBreakdownCard } from '@frontend/components/RatingBreakdownCard';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';

const PlanPreview = ({ subdomain }: { subdomain: string | null }) => {
  const { goToCreator } = useSmartNavigate();

  const { slug } = useParams<{
    slug: string;
  }>();

  const [planPreveiw, setPlanPreveiw] = useState<PlanPaidPreveiw | null>(null);
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);
  const [reviews, setReviews] = useState<CreatorPageReviewDTO[] | null>(null);

  const params = new URLSearchParams(window.location.search);
  const openCheckout = params.get('openCheckout') === 'true';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!subdomain || !slug) return;
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          `/api/v1/plans/preview/${subdomain}/${slug}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PlanPaidPreveiw = await response.json();
        setPlanPreveiw(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (subdomain && slug) {
      fetchPlan();
    }
  }, [subdomain, slug]);

  useEffect(() => {
    if (!planPreveiw) return;
    const fetchCreator = async () => {
      try {
        const res = await fetch(`/api/v1/creators/${planPreveiw.creatorId}`);
        if (!res.ok) throw new Error('Creator not found');
        const data = await res.json();
        setCreator(data);
      } catch (err) {
        console.error('Error fetching creator:', err);
      }
    };

    fetchCreator();
  }, [planPreveiw]);

  useEffect(() => {
    if (!planPreveiw) return;
    const fetchReviews = async () => {
      try {
        const reviewRes = await fetch(
          `/api/v1/plans/${planPreveiw.id}/reviews`
        );
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
    };
    fetchReviews();
  }, [planPreveiw]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  if (!planPreveiw) {
    return (
      <div className="min-h-screen-navbar bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Plan not found</h2>
          <p className="text-muted-foreground">
            The plan you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }
  //TODO: in all pages, don't prevent everything from loading, just the components.
  if (!reviews) {
    return (
      <div className="min-h-screen-navbar bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Can't load reviews</h2>
        </div>
      </div>
    );
  }

  const plan = planPreveiw!;

  const hasDiscount = plan.originalPrice && plan.originalPrice > plan.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((plan.originalPrice! - plan.price) / plan.originalPrice!) * 100
      )
    : 0;

  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8 rounded-lg overflow-hidden">
          <img
            src={plan.image || `/default.jpg`}
            alt={plan.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {plan.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {plan.duration} weeks
                </div>
                <div className="flex items-center">
                  <Play className="mr-1 h-4 w-4" />
                  {plan.totalWorkouts} workouts
                </div>
                <Badge variant="secondary">{plan.difficulty}</Badge>
              </div>
            
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-500 fill-current" />
                    <span>
                      {plan.avgRating} ({plan.noReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Program Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.weeksInfo.map((week, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 text-3xl bg-muted flex items-center justify-center overflow-hidden rounded shrink-0">
                        <span role="img" aria-label={`Week ${index + 1} emoji`}>
                          {week.emoj}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">
                          {' '}
                          Week {week.id}: {week.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {week.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      ${plan.price}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${plan.originalPrice}
                        </span>
                        <Badge className="bg-red-500 hover:bg-red-600">
                          -{discountPercentage}%
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One-time purchase • Sold by TrainWithX
                  </p>
                </div>
                <BuyButton autoOpen={openCheckout} planId={plan.id} text="Get This Plan" />
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  <span className="font-semibold">TrainWithX handles all checkout, support, and delivery.</span>
                </div>
              </CardContent>
            </Card>
            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14 shadow-md ring-2 ring-primary/20">
                    <AvatarImage
                      src={creator?.avatarUrl}
                      alt={creator?.username}
                    />
                    <AvatarFallback>
                      {creator?.username
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{creator?.username}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                      {creator?.bio}
                    </p>
                  
                    <p className="text-xs text-muted-foreground mb-3">
                      <span className="font-semibold">{creator?.username}</span> is a licensed creator on <span className="text-primary font-semibold">TrainWithX</span>. All plans are sold and supported by TrainWithX.
                    </p>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        goToCreator({ subdomain: creator!.subdomain })
                      }
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Breakdown */}
            <RatingBreakdownCard reviews={reviews} />
          </div>
        </div>

        <div className="my-8 text-2xl space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage
                      src={review.userAvatar}
                      alt={review.userUsername}
                    />
                    <AvatarFallback>
                      {review.userUsername
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {review.userUsername}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="shadow-xl border-2">
          <CardContent className="p-8">
            {/* Pricing */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">
                  ${plan.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-red-500 line-through font-medium">
                      ${plan.originalPrice}
                    </span>
                    <Badge className="bg-red-500 hover:bg-red-500 text-white font-semibold">
                      -{discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="text-green-600 font-semibold mb-2">
                  You save ${(plan.originalPrice! - plan.price).toFixed(0)}!
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                One-time payment • Lifetime access
              </p>
            </div>

            {/* CTA Button */}
            <BuyButton
              planId={plan.id}
              text="Start Your Transformation"
  className="w-full gradient-bg from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm sm:text-base md:text-lg text-white font-bold py-4 px-6 rounded-xl mb-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            ></BuyButton>
            {/* Trust Signals */}
            <div className="space-y-3 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-blue-500" />
                  <span>Instant access</span>
                </div>
              </div>
              <p>✓ 30-day money-back guarantee</p>
            </div>
          </CardContent>
        </Card>
        {/* Disclaimer at bottom */}
        <div className="mt-8 text-xs text-muted-foreground text-center">
          <span className="font-semibold">TrainWithX is the sole vendor. Creators license their content to TrainWithX, and all sales, payments, and support are handled by us.</span>
        </div>
      </div>
    </div>
  );
};

export default PlanPreview;
