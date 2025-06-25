import './PlanCard.css';
import type { PlanPreview } from '@shared/types/plan';

interface Props {
  plan: PlanPreview;
}

function PlanCard({ plan }: Props) {
  return (
    <div className="plan-card">
      <div className="plan-header">
        <h3 className="plan-title">{plan.title}</h3>
        <span className="plan-price">${plan.price}</span>
      </div>
      <p className="plan-subdomain">{plan.creatorSubdomain}.trainwithx.com</p>
      <p className="plan-username">@{plan.creatorUsername}</p>
    </div>
  );
}

export default PlanCard;
