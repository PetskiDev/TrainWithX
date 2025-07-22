import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Save, Eye, X } from 'lucide-react';
import type {
  CreatePlanDto,
  Exercise,
  PlanDay,
  PlanWeek,
} from '@shared/types/plan';
import type { CreatorPreviewDTO } from '@shared/types/creator';
import { useAuth } from '@frontend/context/AuthContext';
import { Badge } from '@frontend/components/ui/badge';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';
import { toast } from '@frontend/hooks/use-toast';


const availableTags = ["Strength Training", "Fat Loss", "Home Workout", "Gym"];


const CreateOrEditPlan = ({ init, planId }: { init?: CreatePlanDto, planId?: number }) => {
  const { goPublic, goToCreator } = useSmartNavigate();

  const isEditing = !!init && planId;
  const { user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);
  const [allCreators, setAllCreators] = useState<CreatorPreviewDTO[] | null>(
    null
  );
  const [customTag, setCustomTag] = useState("");

  const [planData, setPlanData] = useState<CreatePlanDto>({
    creatorId: -1, //fetched below
    title: '',
    description: '',
    difficulty: 'beginner',
    price: 25,
    originalPrice: undefined,
    slug: '',
    goals: [],
    tags: [],
    weeks: [],
    features: [],
  });

  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    const fetchAllCreators = async () => {
      try {
        const res = await fetch('/api/v1/creators', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch creators');
        const creators = await res.json();
        setAllCreators(creators);
      } catch (err) {
        console.error('Error loading all creators:', err);
        setError('Failed to load creators. Please try again later.');
      }
    };
    fetchAllCreators();
  }, [user, init]);
  useEffect(() => {
    const fetchCreator = async () => {
      if (!user) return;
      try {
        //TODO: Change to me?
        const res = await fetch(`/api/v1/creators/${user.id}`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('User is not creator');
        }

        const c = await res.json();
        setCreator(c);

        if (!init) {
          setPlanData((prev) => ({
            ...prev,
            creatorId: c.id,
          }));
        }
      } catch (err) {
        console.error('Failed to load creator:', err);
        setError('Failed to load creator.');
      }
    };

    fetchCreator();
  }, [user, init]);

  //hydrate form
  useEffect(() => {
    if (init) {
      setPlanData(init);
    }
  }, [init]);

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 font-semibold mb-2">
          You must be logged in to create or edit a plan.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => goPublic('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }
  if (!user.isAdmin && !creator) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 font-semibold mb-2">
          You must be a creator to create a plan.
        </p>
      </div>
    );
  }

  // Basic plan info handlers
  const updateBasicInfo = (
    field: keyof CreatePlanDto,
    value: string | number | File | null | undefined
  ) => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

  // Week management
  const addWeek = () => {
    const newWeek: PlanWeek = {
      id: planData.weeks.length + 1,
      title: `Week ${planData.weeks.length + 1}`,
      description: '',
      emoj: '🆕',
      days: [],
    };
    setPlanData((prev) => ({
      ...prev,
      weeks: [...prev.weeks, newWeek],
    }));
  };

  const updateWeek = (weekId: number, field: keyof PlanWeek, value: any) => {
    setPlanData((prev) => ({
      ...prev,
      weeks: prev.weeks.map((week) =>
        week.id === weekId ? { ...week, [field]: value } : week
      ),
    }));
  };

  const deleteWeek = (weekId: number) => {
    setPlanData((prev) => ({
      ...prev,
      weeks: prev.weeks.filter((week) => week.id !== weekId),
    }));
  };

  // Day management
  const addDay = (weekId: number) => {
    const week = planData.weeks.find((w) => w.id === weekId);
    const newDay: PlanDay = {
      id: (week?.days.length || 0) + 1,
      title: `Day ${(week?.days.length || 0) + 1}`,
      type: 'workout',
      exercises: [],
      completed: false,
    };

    updateWeek(weekId, 'days', [...(week?.days || []), newDay]);
  };

  const updateDay = (
    weekId: number,
    dayId: number,
    field: keyof PlanDay,
    value: any
  ) => {
    const week = planData.weeks.find((w) => w.id === weekId);
    if (!week) return;

    const updatedDays = week.days.map((day) =>
      day.id === dayId ? { ...day, [field]: value } : day
    );
    updateWeek(weekId, 'days', updatedDays);
  };

  const deleteDay = (weekId: number, dayId: number) => {
    const week = planData.weeks.find((w) => w.id === weekId);
    if (!week) return;

    const updatedDays = week.days.filter((day) => day.id !== dayId);
    updateWeek(weekId, 'days', updatedDays);
  };

  // Exercise management
  const addExercise = (weekId: number, dayId: number) => {
    const week = planData.weeks.find((w) => w.id === weekId);
    const day = week?.days.find((d) => d.id === dayId);
    if (!day) return;

    const newExercise: Exercise = {
      name: '',
      sets: 3,
      reps: '12',
      weight: 'Bodyweight',
    };

    const updatedExercises = [...(day.exercises || []), newExercise];
    updateDay(weekId, dayId, 'exercises', updatedExercises);
  };

  const updateExercise = (
    weekId: number,
    dayId: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: any
  ) => {
    const week = planData.weeks.find((w) => w.id === weekId);
    const day = week?.days.find((d) => d.id === dayId);
    if (!day?.exercises) return;

    const updatedExercises = day.exercises.map((exercise, index) =>
      index === exerciseIndex ? { ...exercise, [field]: value } : exercise
    );

    updateDay(weekId, dayId, 'exercises', updatedExercises);
  };

  const deleteExercise = (
    weekId: number,
    dayId: number,
    exerciseIndex: number
  ) => {
    const week = planData.weeks.find((w) => w.id === weekId);
    const day = week?.days.find((d) => d.id === dayId);
    if (!day?.exercises) return;

    const updatedExercises = day.exercises.filter(
      (_, index) => index !== exerciseIndex
    );
    updateDay(weekId, dayId, 'exercises', updatedExercises);
  };

  // Goals and Tags management
  const addGoal = () => {
    setPlanData((prev) => ({
      ...prev,
      goals: [...prev.goals, ''],
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setPlanData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal, i) => (i === index ? value : goal)),
    }));
  };

  const removeGoal = (index: number) => {
    setPlanData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };


  const addFeature = () => {
    setPlanData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setPlanData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature)),
    }));
  };

  const removeFeature = (index: number) => {
    setPlanData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    setPlanData({ ...planData, tags: [...planData.tags, tag.trim()] });
    setCustomTag("");
  };


  const removeTag = (index: number) => {
    const newTags = [...planData.tags];
    newTags.splice(index, 1);
    setPlanData({ ...planData, tags: newTags });
  };

  const handlePreview = () => {
    console.log('Previewing plan:', planData);
    // Here you would navigate to preview
  };

  const handleSave = async () => {
    try {
      const endpoint = isEditing
        ? `/api/v1/plans/${planId}`
        : `/api/v1/plans`;

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Use backend-sent error message if available
        throw new Error(errorData?.error || `Failed to ${isEditing ? 'update' : 'create'} plan`);
      }

      const saved = await res.json();
      toast({
        title: `Plan ${isEditing ? 'updated' : 'created'} successfully`,
        description: `"${saved.title}" has been saved.`,
      });
      if (user.isAdmin) {
        const c = allCreators?.find(a => a.id == planData.creatorId);
        goToCreator({ subdomain: c!.subdomain, path: `/${planData.slug}` });

      }
      else if (creator) {
        goToCreator({ subdomain: creator.subdomain, path: `/${planData.slug}` });
      }
      else {
        console.error("SHOULD NOT HAPPEN");
      }

    } catch (err: any) {
      console.error('Error saving plan:', err);
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong while saving the plan.',
        variant: 'destructive',
      });
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {`Create New Plan ${user.isAdmin ? '(admin)' : ''}`}
            </h1>
            <p className="text-muted-foreground">
              Build your training plan step by step
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Plan
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Plan Content</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Plan Title</Label>
                    <Input
                      id="title"
                      value={planData.title}
                      onChange={(e) => updateBasicInfo('title', e.target.value)}
                      placeholder="e.g., 30-Day Muscle Building Program"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Plan Slug</Label>
                    <Input
                      id="slug"
                      value={planData.slug}
                      onChange={(e) => updateBasicInfo('slug', e.target.value)}
                      placeholder="e.g., 30-day-muscle-building"
                    />
                    <p className="text-xs text-muted-foreground">
                      {user.isAdmin ? 'admin' : creator?.subdomain}
                      .trainwithx.com/
                      {planData.slug || 'your-slug'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={planData.difficulty}
                    onValueChange={(value) =>
                      updateBasicInfo('difficulty', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={planData.price}
                      onChange={(e) =>
                        updateBasicInfo('price', Number(e.target.value))
                      }
                      placeholder="79"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">
                      Original Price ($) - Optional
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={planData.originalPrice || undefined}
                      onChange={(e) =>
                        updateBasicInfo(
                          'originalPrice',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="99"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={planData.description}
                    onChange={(e) =>
                      updateBasicInfo('description', e.target.value)
                    }
                    placeholder="Describe what your plan includes and who it's for..."
                    rows={4}
                  />
                </div>

                {/* Creator Selection - Admin Only */}

                {!isEditing && user.isAdmin && (
                  <div className="space-y-2 pt-6 border-t">
                    <Label htmlFor="selectedCreator">
                      Assign to Creator (Admin Only)
                    </Label>
                    <Select
                      value={
                        planData.creatorId > 0 ? String(planData.creatorId) : ''
                      }
                      onValueChange={(value) =>
                        updateBasicInfo('creatorId', Number(value))
                      }
                      disabled={!allCreators}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a creator" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCreators && allCreators.length > 0 ? (
                          allCreators.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              (@{c.username})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">
                            No creators available.
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This field is only visible to admin users. Leave empty to
                      assign to yourself.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              {/* Goals Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      What will users achieve with this plan? (this section is available when the user purchases the plan)
                    </p>
                    <Button size="sm" onClick={addGoal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>

                  {planData.goals.map((goal, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                        placeholder="e.g., Build lean muscle mass"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGoal(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {planData.goals.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No goals added yet. Click "Add Goal" to get started.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Selling point of this plan. (This is listed on the plan purchase card)
                    </p>
                    <Button size="sm" onClick={addFeature}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>

                  {planData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="e.g., 4-week progressive overload program"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {planData.features.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No features added yet. Click "Add Feature" to get started.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tags Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label>Tags help users discover your plan</Label>

                  {/* Selected tags as badges */}
                  {planData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {planData.tags.map((tag, index) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeTag(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}


                  {/* Suggested tags */}
                  <div className="flex flex-wrap gap-2">
                    {availableTags
                      .filter((tag) => !planData.tags.includes(tag))
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => addTag(tag)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                  </div>

                  {/* Add custom tag input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag(customTag))
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(customTag)}
                      disabled={!customTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Structure */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Plan Structure</h2>
                <Button onClick={addWeek}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Week
                </Button>
              </div>

              {/* Weeks */}
              {planData.weeks.map((week) => (
                <Card key={week.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Input
                        value={week.title}
                        onChange={(e) =>
                          updateWeek(week.id, 'title', e.target.value)
                        }
                        className="text-lg font-semibold border-none p-0 h-auto max-w-md"
                        placeholder="Week title"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWeek(week.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={week.description}
                      onChange={(e) =>
                        updateWeek(week.id, 'description', e.target.value)
                      }
                      placeholder="What will users focus on this week?"
                      rows={2}
                      className="mt-2"
                    />
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Days</h4>
                      <Button size="sm" onClick={() => addDay(week.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day
                      </Button>
                    </div>

                    {/* Days */}
                    {week.days.map((day) => (
                      <Card key={day.id} className="ml-4">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Input
                                value={day.title}
                                onChange={(e) =>
                                  updateDay(
                                    week.id,
                                    day.id,
                                    'title',
                                    e.target.value
                                  )
                                }
                                className="font-medium border-none p-0 h-auto max-w-sm"
                                placeholder="Day name"
                              />
                              <Select
                                value={day.type}
                                onValueChange={(value) =>
                                  updateDay(week.id, day.id, 'type', value)
                                }
                              >
                                <SelectTrigger className="w-auto h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="workout">
                                    Workout
                                  </SelectItem>
                                  <SelectItem value="rest">Rest Day</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDay(week.id, day.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Workout Section */}
                          {day.type === 'workout' && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label>Exercises</Label>
                                <Button
                                  size="sm"
                                  onClick={() => addExercise(week.id, day.id)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Exercise
                                </Button>
                              </div>

                              {day.exercises?.map((exercise, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg"
                                >
                                  <Input
                                    value={exercise.name}
                                    onChange={(e) =>
                                      updateExercise(
                                        week.id,
                                        day.id,
                                        index,
                                        'name',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Exercise name"
                                    className="col-span-4"
                                  />
                                  <Input
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) =>
                                      updateExercise(
                                        week.id,
                                        day.id,
                                        index,
                                        'sets',
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="Sets"
                                    className="col-span-2"
                                  />
                                  <Input
                                    value={exercise.reps}
                                    onChange={(e) =>
                                      updateExercise(
                                        week.id,
                                        day.id,
                                        index,
                                        'reps',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Reps"
                                    className="col-span-2"
                                  />
                                  <Input
                                    value={exercise.weight}
                                    onChange={(e) =>
                                      updateExercise(
                                        week.id,
                                        day.id,
                                        index,
                                        'weight',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Weight"
                                    className="col-span-2"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="col-span-2"
                                    onClick={() =>
                                      deleteExercise(week.id, day.id, index)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Rest Day Content */}
                          {day.type === 'rest' && (
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                              <h3 className="font-medium mb-1">Rest Day</h3>
                              <p className="text-sm text-muted-foreground">
                                Recovery is essential for muscle growth and
                                preventing injury
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {week.days.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No days added yet. Click "Add Day" to get started.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}

              {planData.weeks.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No weeks added yet
                    </p>
                    <Button onClick={addWeek}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Week
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateOrEditPlan;
