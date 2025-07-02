import { BuyButton } from '@frontend/components/BuyButton';
import './PlanCard.css';
import type { PlanPreview } from '@shared/types/plan';

type Props = { plan: PlanPreview };

function PlanCard({ plan }: Props) {
  const imageUrl = `/plan_images/${plan.slug}.jpg`;

  return (
    <div className="plan-card">
      <div className="plan-image">
        <img
          src={imageUrl}
          alt={plan.title}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null; // Prevent infinite loop
            img.src = '/plan_images/default.jpg';
          }}
        />
      </div>

      <div className="plan-body">
        <h3 className="plan-title">{plan.title}</h3>
        <p className="plan-creator">by {plan.creatorUsername}</p>

        <div className="plan-price">
          <span className="price">${plan.price}</span>
          {plan.originalPrice && (
            <span className="original-price">${plan.originalPrice}</span>
          )}
        </div>
        <BuyButton planId={plan.id}></BuyButton>
      </div>
    </div>
  );
}

export default PlanCard;
