import type { PlanPreview } from '@shared/types/plan';
import { lazy, Suspense } from 'react';

const PlanCardNew = lazy(() => import('@frontend/components/PlanCardNew'));

interface Props {
  plans: PlanPreview[];
  onPlanClick?: (id: string) => void;
}

function PlansGrid({ plans }: Props) {
  if (!plans.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
          No plans found 🙁
        </h3>
        <p className="text-muted-foreground">
          Check back later for new fitness plans!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <Suspense
          key={plan.id}
          fallback={<div className="h-[400px] bg-muted rounded-xl animate-pulse" />}
        >
          <PlanCardNew plan={plan} showCreator />
        </Suspense>
      ))}
    </div>
  );
}

export default PlansGrid;
