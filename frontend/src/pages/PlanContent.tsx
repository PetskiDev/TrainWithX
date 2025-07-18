import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Video,
  Users,
  MessageCircle,
  Share2,
  Star,
  Coffee,
  Send,
  Pencil,
} from 'lucide-react';
import type { PlanPaidPreveiw } from '@shared/types/plan';
import { useParams } from 'react-router-dom';
import type { CreatorPreviewDTO } from '@shared/types/creator';
import type { CreateReviewDTO, ReviewPreviewDTO } from '@shared/types/review';
import { Textarea } from '@frontend/components/ui/textarea';
import { toast } from '@frontend/hooks/use-toast';

const PlanContent = ({ subdomain }: { subdomain: string | null }) => {
  const { slug } = useParams<{
    slug: string;
  }>();

  const [planPaid, setPlanPaid] = useState<PlanPaidPreveiw | null>(null);
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  const [isEditingReview, setIsEditingReview] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewPreviewDTO>();

  const reviewSectionRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (!subdomain || !slug) return;
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          `/api/v1/plans/content/${subdomain}/${slug}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PlanPaidPreveiw = await response.json();
        setPlanPaid(data);
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
    if (!planPaid?.creatorId) return;

    const fetchCreator = async () => {
      try {
        const res = await fetch(
          `/api/v1/creators/by-subdomain/${planPaid.creatorSubdomain}`
        );
        if (!res.ok) throw new Error('Creator not found');
        const data = await res.json();
        setCreator(data);
      } catch (err) {
        console.error('Error fetching creator:', err);
      }
    };

    fetchCreator();
  }, [planPaid]);

  useEffect(() => {
    if (!planPaid?.id) return;

    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/v1/plans/${planPaid.id}/reviews/me`, {
          credentials: 'include',
        });

        if (res.status === 404) {
          setHasSubmittedReview(false);
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch review');

        const data: ReviewPreviewDTO = await res.json();
        setExistingReview({
          rating: data.rating,
          comment: data.comment,
          createdAt: data.createdAt,
          planId: -1,
          userId: -1, //no need for these I didn't have created at
        });
        setReviewRating(data.rating);
        setReviewText(data.comment);
        setHasSubmittedReview(true);

      } catch (err) {
        console.error('Error fetching review:', err);
      }
    };

    fetchReview();
  }, [planPaid?.id]);


  if (!planPaid) {
    return <div className="text-center py-10">Canno't load plan</div>;
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }



  const planContent = planPaid!;

  const currentWeek = planContent.weeks.find((w) => w.id === selectedWeek);

  const completedWorkouts = 404; //TODO FETCH
  const progress = planContent.totalWorkouts ?? 10 / completedWorkouts; //TODO

  const markWorkoutComplete = async (weekId: number, dayId: number) => {
    try {
      const res = await fetch('/api/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId: planPaid.id, weekId, dayId }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to mark workout complete');

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      updateWeekDayCompleted(weekId, dayId);

      toast({
        title: "Workout Completed",
        description: `You’ve completed Day ${dayId} of Week ${weekId}! 💪`,
        variant: "default",
      });

      console.log('Workout marked complete:', data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong while marking the workout.",
        variant: "destructive",
      });
    }
  };
  const playIntroVideo = () => {
    setVideoPlaying(true);
    // Here you would handle video playback
  };

  const handleCancelEdit = () => {
    setReviewRating(0);
    setReviewText("");
    setIsEditingReview(false);
  };

  const handleEditReview = () => {
    if (!existingReview) return;
    setIsEditingReview(true);
    setReviewRating(existingReview.rating);
    setReviewText(existingReview.comment);
  };

  const updateWeekDayCompleted = (weekId: number, dayId: number) => {
    if (!planPaid) return;

    const updatedWeeks = planPaid.weeks.map((week) => {
      if (week.id !== weekId) return week;

      const updatedDays = week.days.map((day) =>
        day.id === dayId ? { ...day, completed: true } : day
      );

      return { ...week, days: updatedDays };
    });

    setPlanPaid({ ...planPaid, weeks: updatedWeeks });
  };

  const handleSubmitAndEdit = async () => {
    if (reviewRating === 0 || !reviewText.trim()) return;
    const payload: CreateReviewDTO = {
      planId: planPaid.id,
      comment: reviewText.trim(),
      rating: reviewRating,
    }
    const method = isEditingReview ? 'PUT' : 'POST';

    try {
      const response = await fetch('/api/v1/reviews', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // to send cookies for auth, if required

      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isEditingReview ? 'update' : 'submit'} review`);
      }
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });

      setReviewRating(0);
      setReviewText('');


      setExistingReview({
        rating: payload.rating,
        comment: payload.comment ?? '',
        createdAt: new Date(), // or await response.json().createdAt if returned
        planId: -1,
        userId: -1, // Optional: fill in actual userId if you store it
      });

      setIsEditingReview(false);
      setHasSubmittedReview(true);
    } catch (err: any) {
      console.error('Error submitting review:', err.message);
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveReview = async () => {
    try {
      const response = await fetch(`/api/v1/plans/${planPaid?.id}/reviews/me`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete review');
      }

      toast({
        title: 'Review Removed',
        description: 'Your review has been successfully deleted.',
      });

      setExistingReview(undefined);
      setHasSubmittedReview(false);
      setReviewRating(0);
      setReviewText('');
      setIsEditingReview(false);
    } catch (err: any) {
      console.error('Error removing review:', err);
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };
  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={creator?.avatarUrl}
                  alt={planContent.creatorUsername} // ensures there is something if the fetch fails for some reason
                />
                <AvatarFallback>
                  {planContent.creatorUsername
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">
                  Created by @{planContent.creatorUsername}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">{planContent.avgRating} ({planContent.noReviews} reviews) </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab('add-review');
                  setTimeout(() => {
                    reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 0); // Delay ensures the section is rendered before scroll
                }}
              >
                <Star className="h-4 w-4 mr-2" />
                {hasSubmittedReview ? 'View Review' : 'Add Review'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{planContent.title}</h1>
            <Badge
              variant={
                planContent.difficulty === 'beginner'
                  ? 'secondary'
                  : planContent.difficulty === 'intermediate'
                    ? 'default'
                    : 'destructive'
              }
            >
              {planContent.difficulty &&
                planContent.difficulty.charAt(0).toUpperCase() +
                planContent.difficulty.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            {planContent.description}
          </p>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">{progress}%</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <Progress value={progress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {completedWorkouts}/{planContent.totalWorkouts}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Community</p>
                    <p className="text-2xl font-bold">1.2k</p>
                  </div>
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} ref={reviewSectionRef}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="add-review">{hasSubmittedReview ? 'View Review' : 'Add Review'}</TabsTrigger>

          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Intro Video */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Welcome Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {!videoPlaying ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Button
                          onClick={playIntroVideo}
                          size="lg"
                          className="gap-2"
                        >
                          <Play className="h-5 w-5" />
                          Play Introduction
                        </Button>
                      </div>
                    ) : (
                      <video
                        src={planContent.introVideo}
                        controls
                        className="w-full h-full object-cover"
                        autoPlay
                      />
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      5:30
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {planContent.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Week Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Program Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {planContent.weeks.map((week) => (
                      <div
                        key={week.id}
                        className="p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              Week {week.id}: {week.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {week.description}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="ml-1"
                            onClick={() => {
                              setSelectedWeek(week.id);
                              setActiveTab('workouts');
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts">
            <div className="space-y-6">
              {/* Week selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {planContent.weeks.map((week) => (
                      <Button
                        key={week.id}
                        variant={
                          selectedWeek === week.id ? 'default' : 'outline'
                        }
                        onClick={() => setSelectedWeek(week.id)}
                      >
                        Week {week.id}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Week Content */}
              {currentWeek && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Week {currentWeek.id}: {currentWeek.title}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {currentWeek.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentWeek.days.map((day) => (
                        <Card
                          key={day.id}
                          className="border-l-4 border-l-primary"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-full ${day.type === 'workout'
                                    ? 'bg-primary/10'
                                    : day.type === 'rest'
                                      ? 'bg-orange-500/10'
                                      : 'bg-green-500/10'
                                    }`}
                                >
                                  {day.type === 'workout' ? (
                                    <Target className="h-5 w-5 text-primary" />
                                  ) : day.type === 'rest' ? (
                                    <Coffee className="h-5 w-5 text-orange-500" />
                                  ) : (
                                    <Calendar className="h-5 w-5 text-green-500" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{day.title}</h3>
                                  {day.duration && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Clock className="h-4 w-4" />
                                      {day.duration}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {true && (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                )}
                                {day.type === 'rest' ? (
                                  <Badge variant="secondary" className="gap-1">
                                    <Coffee className="h-3 w-3" />
                                    Rest Day
                                  </Badge>
                                ) : (
                                  <Button
                                    variant={true ? 'outline' : 'default'}
                                    onClick={() => markWorkoutComplete(currentWeek.id, day.id)}
                                  >
                                    {day.completed ? 'Completed' : 'Start'}
                                  </Button>
                                )}
                              </div>
                            </div>

                            {day.type === 'rest' && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-center">
                                <Coffee className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Take time to recover and let your muscles
                                  rebuild stronger
                                </p>
                              </div>
                            )}

                            {day.exercises && day.type !== 'rest' && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Exercises:</h4>
                                {day.exercises.map((exercise, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span>{exercise.name}</span>
                                    <span className="text-muted-foreground">
                                      {exercise.sets} sets × {exercise.reps} (
                                      {exercise.weight})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nutrition">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-semibold text-lg">Daily Calories</h3>
                      <p className="text-2xl font-bold text-primary">2,400</p>
                    </div>
                    <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                      <h3 className="font-semibold text-lg">Protein</h3>
                      <p className="text-2xl font-bold text-blue-500">150g</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/5 rounded-lg">
                      <h3 className="font-semibold text-lg">Water</h3>
                      <p className="text-2xl font-bold text-green-500">3L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meal Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your personalized meal plans are integrated into your daily
                    workout schedule. Check the "Workouts" tab to see your daily
                    nutrition plan.
                  </p>
                  <Button onClick={() => setActiveTab('workouts')}>
                    View Daily Meal Plans
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Overall Progress</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Workouts Completed</span>
                        <span className="font-semibold">
                          {completedWorkouts}/{planContent.totalWorkouts}
                        </span>
                      </div>
                      <Progress
                        value={
                          (completedWorkouts /
                            (planContent.totalWorkouts ?? 2)) *
                          100
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Join the Community</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with other members following this plan
                    </p>
                    <Button>Join Discussion</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="add-review">
            <div className="space-y-6">
              {/* Existing Review Display */}
              {hasSubmittedReview && existingReview && !isEditingReview && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Review</CardTitle>
                    <p className="text-muted-foreground">
                      Submitted on {new Date(existingReview?.createdAt)?.toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Display Rating */}
                      <div>
                        <h3 className="font-medium mb-2">Your Rating</h3>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= existingReview.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground'
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {existingReview.rating} out of 5 stars
                        </p>
                      </div>

                      {/* Display Review Text */}
                      <div>
                        <h3 className="font-medium mb-2">Your Review</h3>
                        <p className="text-muted-foreground bg-muted/30 p-3 rounded-lg">
                          {existingReview.comment}
                        </p>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button onClick={handleRemoveReview} variant="outline" className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                          Remove Review
                        </Button>
                        <Button onClick={handleEditReview} variant="outline" className="gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Add/Edit Review Form */}
              {(!hasSubmittedReview || isEditingReview) && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isEditingReview ? 'Edit Your Review' : 'Add Your Review'}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {isEditingReview
                        ? 'Update your experience with this program'
                        : 'Share your experience with this program to help others'
                      }
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Rating Section */}
                      <div>
                        <h3 className="font-medium mb-3">Your Rating</h3>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-6 w-6 ${star <= reviewRating
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted-foreground'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                        {reviewRating > 0 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            You rated this program {reviewRating} out of 5 stars
                          </p>
                        )}
                      </div>

                      {/* Review Text */}
                      <div>
                        <h3 className="font-medium mb-3">Your Review</h3>
                        <Textarea
                          placeholder="Tell others about your experience with this program. What did you like? What results did you achieve?"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="min-h-[120px]"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          {reviewText.length}/500 characters
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2">
                        {isEditingReview && (
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          onClick={handleSubmitAndEdit}
                          disabled={reviewRating === 0 || !reviewText.trim()}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          {isEditingReview ? 'Update Review' : 'Submit Review'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guidelines Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Be honest and constructive in your feedback</li>
                    <li>• Focus on your experience with the program</li>
                    <li>• Mention specific results or improvements you noticed</li>
                    <li>• Keep your review respectful and appropriate</li>
                    <li>• Reviews are public and help other users make informed decisions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default PlanContent;
