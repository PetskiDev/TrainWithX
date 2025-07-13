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
import { goPublic } from '@frontend/lib/nav';

const CreatePlan = ({ init }: { init?: CreatePlanDto }) => {
  const isEditing = !!init;
  const { user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);
  const [allCreators, setAllCreators] = useState<CreatorPreviewDTO[] | null>(
    null
  );
  const [planData, setPlanData] = useState<CreatePlanDto>({
    title: '',
    description: '',
    difficulty: 'beginner',
    price: 25,
    originalPrice: undefined,
    slug: '',
    goals: [],
    tags: [],
    weeks: [],
    creatorId: -1, //Handle below
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

  const addTag = () => {
    setPlanData((prev) => ({
      ...prev,
      tags: [...prev.tags, ''],
    }));
  };

  const updateTag = (index: number, value: string) => {
    setPlanData((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }));
  };

  const removeTag = (index: number) => {
    setPlanData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handlePreview = () => {
    console.log('Previewing plan:', planData);
    // Here you would navigate to preview
  };

  const handleSave = async () => {
    try {
      const endpoint = isEditing
        ? `/api/v1/plans/${planData.slug}`
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
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} plan `);
      }

      const saved = await res.json();
      console.log(`${isEditing ? 'Updated' : 'Created'} plan:`, saved);

      goPublic('/plans');
      // Optional: redirect or show toast
    } catch (err) {
      console.error('Error saving plan:', err);
      setError(String(err));
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                      value={planData.originalPrice || ''}
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

                {user.isAdmin && (
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
                      What will users achieve with this plan?
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

              {/* Tags Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Tags help users discover your plan
                    </p>
                    <Button size="sm" onClick={addTag}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>

                  {planData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder="e.g., strength, beginner, home-workout"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {planData.tags.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No tags added yet. Click "Add Tag" to get started.
                    </p>
                  )}
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

export default CreatePlan;
