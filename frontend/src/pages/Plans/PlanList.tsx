import type { PlanPreview } from '@shared/types/plan';
import PlanCard from './PlanCard';
import './PlanList.css';

interface Props {
  plans: PlanPreview[];
}

function PlanList({ plans }: Props) {
  if (!plans.length) return <p>No plans found 🙁</p>;

  return (
    <div className="plan-grid">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

export default PlanList;
