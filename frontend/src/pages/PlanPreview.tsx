import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Play, Clock, Users, Star } from 'lucide-react';
import type { PlanPaidPreveiw } from '@shared/types/plan';
import type { CreatorPreviewDTO } from '@shared/types/creator';
import { goToCreator } from '@frontend/lib/nav';
import BuyButton from '@frontend/components/BuyButton';

const PlanPreview = ({ subdomain }: { subdomain: string | null }) => {
  const { slug } = useParams<{
    slug: string;
  }>();

  const [planPreveiw, setPlanPreveiw] = useState<PlanPaidPreveiw | null>(null);
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
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
    const fetchCreator = async () => {
      if (!planPreveiw?.creatorId) return;
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
            src={plan.coverImage}
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
                  {'DURATION ADD'}
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
                      {'TODO'} ({'TODO '} reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>Intermediate level</span>
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
                todo
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div> */}
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
                        <h4 className="font-semibold mb-1">  Week {week.id}: {week.title}
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
                    One-time purchase
                  </p>
                </div>
                <BuyButton planId={plan.id}></BuyButton>
                <Button variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={creator?.avatarUrl}
                      alt={creator?.username}
                    />
                    <AvatarFallback>
                      {creator?.username
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{creator?.username}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {creator?.bio}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPreview;
