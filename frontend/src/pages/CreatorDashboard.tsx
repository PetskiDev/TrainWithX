import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlanCard } from '@/components/PlanCard';
import {
  DollarSign,
  ShoppingCart,
  Plus,
  Edit3,
  BarChart3,
  Camera,
  Loader2,
} from 'lucide-react';
import type { PlanWithRevenue } from '@trainwithx/shared';
import { useAuth } from '@frontend/context/AuthContext';
import type { CreatorFullDTO } from '@trainwithx/shared';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';

const CreatorDashboard = () => {
  const { user, loading } = useAuth();
  const { goPublic } = useSmartNavigate();

  // State
  const [plans, setPlans] = useState<PlanWithRevenue[]>([]);
  const [creator, setCreator] = useState<CreatorFullDTO | undefined>(undefined);
  const [plansLoading, setPlansLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [uploadingPlanId, setUploadingPlanId] = useState<number | null>(null);

  // Fetch creator
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    const fetchCreator = async () => {
      try {
        const res = await fetch(`/api/v1/creators/me`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch creator: ${res.status}`);
        const data: CreatorFullDTO = await res.json();
        setCreator(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error(err);
        setError('You are not a creator.');
      }
    };

    fetchCreator();
    return () => controller.abort();
  }, [user]);

  const fetchPlans = useCallback(async () => {
    try {
      setPlansLoading(true);
      const res = await fetch(`/api/v1/creators/me/plans`);
      if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`);
      const data: PlanWithRevenue[] = await res.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch plans.');
    } finally {
      setPlansLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!creator) return;
    fetchPlans();
  }, [creator, fetchPlans]);

  // UI rendering
  if (loading) {
    return (
      <div className="min-h-screen-navbar flex items-center justify-center">
        Loading User...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen-navbar flex items-center justify-center">
        You are not logged in.
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen-navbar flex items-center justify-center">
        Only for creators. Go back to user.
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen-navbar flex items-center justify-center">
        {error}
      </div>
    );
  }
  const handlePlanImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    planId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPEG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be 10MB or less.');
      return;
    }

    setUploadingPlanId(planId);

    try {
      const form = new FormData();
      form.append('image', file); // Ensure backend expects `image`

      const res = await fetch(`/api/v1/plans/${planId}/image`, {
        method: 'PATCH',
        body: form,
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Upload failed');

      await fetchPlans(); // Refresh plans to reflect image change
    } catch (err: any) {
      alert(err.message || 'Upload error');
      console.error(err);
    } finally {
      setUploadingPlanId(null);
      e.target.value = '';
    }
  };

  const activePlansNum = plans.length;
  const totalRevenue = plans.reduce((prev, curr) => prev + curr.revenue, 0);

  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="md:flex md:flex-col items-start text-center">
            <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your plans and track your performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link
                to="/me/creator/edit"
                state={{ creator }}
                className="flex items-center"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild>
              <Link to="/me/creator/create-plan" className="flex items-center">
                <Plus className="h-4 w-4" />
                Add New Plan
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{creator.totalSales}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${totalRevenue.toLocaleString()}{' '}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                  <p className="text-2xl font-bold">{activePlansNum}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid Out</p>
                  <p className="text-2xl font-bold">{0}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Plans</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/me/creator/create-plan">
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Link>
            </Button>
          </div>

          {plansLoading ? (
            <div>Loading plans...</div>
          ) : plans.length === 0 ? (
            <div>You don't own any plans yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <PlanCard plan={plan} onPlanClick={()=>{}} />

                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 border border-green-400 text-green-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm">
                    💰 <span>${plan.revenue.toLocaleString()}</span>
                  </div>
                  <div className="absolute top-14 left-3 flex items-center gap-2 bg-white border border-gray-300 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm">
                    🛒 <span>{plan.sales} sales</span>
                  </div>
                  <div className="absolute top-[153px] left-3">
                    <label
                      htmlFor={`plan-image-${plan.id}`}
                      className="cursor-pointer"
                    >
                      <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors">
                        {uploadingPlanId === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </div>
                    </label>
                    <input
                      id={`plan-image-${plan.id}`}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handlePlanImageUpload(e, plan.id)}
                      className="hidden"
                    />
                  </div>
                  <Button
                    onClick={() => goPublic(`/plans/edit/${plan.id}`)}
                    className="absolute top-36 right-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow"
                  >
                    ✏️ Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
