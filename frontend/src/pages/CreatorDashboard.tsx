import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/PlanCard";
import {
  DollarSign,
  ShoppingCart,
  Plus,
  Edit3,
  Eye,
  BarChart3
} from "lucide-react";
import type { PlanCreatorData } from "@shared/types/plan";
import { useAuth } from "@frontend/context/AuthContext";
import type { CreatorFullDTO } from "@shared/types/creator";

const CreatorDashboard = () => {
  const { user, loading } = useAuth();

  // State
  const [plans, setPlans] = useState<PlanCreatorData[]>([]);
  const [creator, setCreator] = useState<CreatorFullDTO | undefined>(undefined);
  const [plansLoading, setPlansLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch creator
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    const fetchCreator = async () => {
      try {
        const res = await fetch(`/api/v1/me/creator`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch creator: ${res.status}`);
        const data: CreatorFullDTO = await res.json();
        setCreator(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error(err);
        setError("You are not a creator.");
      }
    };

    fetchCreator();
    return () => controller.abort();
  }, [user]);

  useEffect(() => {
    if (!creator) return;

    const controller = new AbortController();
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const res = await fetch(`/api/v1/me/creator/plans`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`);
        const data: PlanCreatorData[] = await res.json();
        setPlans(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error(err);
        setError("Failed to fetch plans.");
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
    return () => controller.abort();
  }, [creator]);

  const handlePlanClick = (planId: number) => {
    console.log("Plan clicked:", planId);
  };

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






  const activePlansNum = plans.length;
  const totalRevenue = plans.reduce((prev, curr) => prev + curr.revenue, 0);


  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="md:flex md:flex-col items-start text-center">
            <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">Manage your plans and track your performance</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/me/creator/edit" state={{ creator }} className="flex items-center">
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
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold">{creator.profileViews}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Eye className="h-5 w-5 text-purple-500" />
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
                <div key={plan.id} className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <PlanCard plan={plan} onPlanClick={handlePlanClick} />
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 border border-green-400 text-green-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm">
                    💰 <span>${plan.revenue.toLocaleString()}</span>
                  </div>
                  <div className="absolute top-14 left-3 flex items-center gap-2 bg-white border border-gray-300 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm">
                    🛒 <span>{plan.sales} sales</span>
                  </div>
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