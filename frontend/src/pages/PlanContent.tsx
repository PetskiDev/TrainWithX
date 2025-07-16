import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import type { PlanPaidPreveiw } from '@shared/types/plan';
import { useParams } from 'react-router-dom';
import type { CreatorPreviewDTO } from '@shared/types/creator';
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

  useEffect(() => {
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
    const fetchCreator = async () => {
      if (!planPaid?.creatorId) return;
      try {
        const res = await fetch(
          `/api/v1/creators/sub/${planPaid.creatorSubdomain}`
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

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }
  if (!planPaid) {
    return <div className="text-center py-10">Canno't load plan</div>;
  }

  const planContent = planPaid!;

  const currentWeek = planContent.weeks.find((w) => w.id === selectedWeek);

  const completedWorkouts = 404; //TODO FETCH
  const progress = planContent.totalWorkouts ?? 10 / completedWorkouts; //TODO

  const markWorkoutComplete = (dayId: number) => {
    console.log(`Marking workout ${dayId} as complete`);
    // Here you would update the workout completion status
  };
  const playIntroVideo = () => {
    setVideoPlaying(true);
    // Here you would handle video playback
  };
  const handleSubmitReview = async () => {
    if (reviewRating === 0 || !reviewText.trim()) return;

    try {
      const response = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planPaid.id, // ensure `plan.id` is accessible
          rating: reviewRating,
          comment: reviewText.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });

      setReviewRating(0);
      setReviewText('');

    } catch (err: any) {
      console.error('Error submitting review:', err.message);
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
              <Button variant="outline" size="sm" onClick={() => setActiveTab('add-review')}>
                <Star className="h-4 w-4 mr-2" />
                Add Review
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="add-review">Add Review</TabsTrigger>

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
                                    onClick={() => markWorkoutComplete(day.id)}
                                  >
                                    {true ? 'Completed' : 'Start'}
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
              <Card>
                <CardHeader>
                  <CardTitle>Add Your Review</CardTitle>
                  <p className="text-muted-foreground">
                    Share your experience with this program to help others
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

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitReview}
                        disabled={reviewRating === 0 || !reviewText.trim()}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
