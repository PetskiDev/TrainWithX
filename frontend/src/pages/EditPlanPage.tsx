import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@frontend/context/AuthContext';
import type { CreatePlanDto, PlanPaidPreveiw } from '@trainwithx/shared';
import CreateOrEditPlan from '@frontend/components/CreateOrEditPlan';

export default function EditPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const planIdNum = Number(planId);
  const { user } = useAuth();

  const [initData, setInitData] = useState<CreatePlanDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planIdNum || !user) return;

    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/v1/plans/${planIdNum}/content`, {
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.message || 'Failed to load plan');
        }

        const data: PlanPaidPreveiw = await res.json();
        setInitData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          difficulty: data.difficulty,
          price: Number(data.price),
          originalPrice: data.originalPrice ?? undefined,
          features: data.features ?? [],
          tags: data.tags ?? [],
          goals: data?.goals ?? [],
          weeks: data?.weeks ?? [],
          creatorId: data.creatorId,
        });
      } catch (err: any) {
        console.error('Error loading plan:', err);
        setError(err.message || 'Unknown error');
      }
    };

    fetchPlan();
  }, [planIdNum, user]);

  if (!user) return <p className="p-4 text-red-500">You must be logged in</p>;
  if (!planIdNum) return <p className="p-4 text-red-500">PlanId not found</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!initData) return <p className="p-4">Loading plan...</p>;

  return <CreateOrEditPlan init={initData} planId={planIdNum} />;
}
