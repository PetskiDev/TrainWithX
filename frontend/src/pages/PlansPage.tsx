import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

import type { PlanPreview } from '@shared/types/plan';
import PlansGrid from '@frontend/components/PlansGrid';
import { goPublic } from '@frontend/lib/nav';

const PlansPage = () => {
  const [plans, setPlans] = useState<PlanPreview[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<PlanPreview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch plans from API on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/v1/plans');
        const data = await res.json();
        setPlans(data);
        setFilteredPlans(data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter plans based on search term
  useEffect(() => {
    const filtered = plans.filter(
      (plan) =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.creatorUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [searchTerm, plans]);

  const handlePlanClick = (planId: number) => {
    goPublic(`/plan/${planId}`);
  };

  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">All Fitness Plans</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Discover amazing fitness plans from top creators
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading plans…</p>
        ) : (
          <PlansGrid
            plans={filteredPlans}
            onPlanClick={() => handlePlanClick}
          />
        )}
      </div>
    </div>
  );
};

export default PlansPage;
