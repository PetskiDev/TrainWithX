import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlanCard } from '@/components/PlanCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  TrendingUp,
  Award,
  Edit2,
  Check,
  X,
  EditIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // 👉 adjust the import path if different
import type { PlanPreview } from '@shared/types/plan';

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────
const Me = () => {
  const { user, loading: authLoading, refreshUser } = useAuth();

  // UI state
  const [activeTab, setActiveTab] = useState<string>('plans');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string | undefined>(
    user?.username
  );

  // Plans state
  const [plans, setPlans] = useState<PlanPreview[]>([]);
  const [plansLoading, setPlansLoading] = useState<boolean>(true);

  // ──────────────────────────────────────────────────────────────────────────────
  // Fetch plans that the authenticated user owns
  // Route: GET /:id/plans (e.g. /123/plans)
  // ──────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const res = await fetch(`/api/v1/users/me/plans`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`);
        const data: PlanPreview[] = await res.json();
        setPlans(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return; // fetch aborted
        console.error(err);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
    return () => controller.abort();
  }, [user]);

  // ──────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────────────────────────────────────────────
  const handlePlanClick = (planId: number) => {
    console.log('Opening plan:', planId);
  };

  const handleEditName = () => {
    if (!user) return;
    setIsEditingName(true);
    setEditedName(user.username);
  };

  const handleSaveName = async () => {
    const newUsername = editedName;
    try {
      const res = await fetch('/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newUsername }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to update username');
        return;
      }
      await refreshUser();

      alert('Username updated successfully!');
      setIsEditingName(false);
    } catch (err: any) {
      console.error('Error saving name:', err.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(user?.username);
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // Derived values & fallbacks
  // ──────────────────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        You are not logged in.
      </div>
    );
  }

  const displayName =
    editedName ?? user.username ?? user.email?.split('@')[0] ?? 'User';
  const joinDateLabel = `Member since ${new Date(
    user.createdAt
  ).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`;
  // Stats (replace with real values from backend when available)
  const totalPlans = plans.length;
  const currentStreak = 0; // TODO: Fetch streak from backend

  // ──────────────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* ──────────────── Welcome Header ──────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback>
                {displayName
                  .split(' ')
                  .map((n) => n.substring(0, 2).toUpperCase())
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="text-2xl font-bold h-10"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveName}
                      disabled={
                        !editedName || editedName.trim() === user?.username
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">
                      Hello, {displayName}! 👋
                    </h1>
                    <Button size="sm" variant="ghost" onClick={handleEditName}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-muted-foreground">{joinDateLabel}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* ──────────────── Stats Cards ──────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Plans</p>
                    <p className="text-2xl font-bold">{totalPlans}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Award className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{123}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Streak
                    </p>
                    <p className="text-2xl font-bold"> Work in Progress...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ──────────────── Content Tabs ──────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="plans">My Plans</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Your Training Plans</h2>

              {plansLoading ? (
                <div>Loading plans...</div>
              ) : plans.length === 0 ? (
                <div>You don't own any plans yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onPlanClick={handlePlanClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            {/* Achievements content – similar structure; replace with dynamic data when available */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-yellow-500/10 rounded-full">
                        <Award className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">First Plan Completed</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed your first training plan
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/10 rounded-full">
                        <Calendar className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Consistency Champion</h3>
                        <p className="text-sm text-muted-foreground">
                          10+ day training streak
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Me;
