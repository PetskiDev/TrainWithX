import type { PlanPreview } from '@shared/types/plan';
import { PlanCard } from './PlanCard';

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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

export default PlansGrid;
