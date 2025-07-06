import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BuyButton } from '@frontend/components/BuyButton';
import type { PlanPreview } from '@shared/types/plan';

type Props = {
  plan: PlanPreview; // add optional description
  onPlanClick?: (id: number) => void;
};

export const PlanCard = ({ plan, onPlanClick }: Props) => {
  const {
    id,
    title,
    slug,
    creatorUsername,
    price,
    originalPrice,
    description,
  } = plan;

  const imageUrl = `/plan_images/${slug}.jpg`;
  const hasDiscount = !!originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleClick = () => {
    onPlanClick?.(id);
  };

  return (
    <Card
      onClick={handleClick}
      className="group flex h-full flex-col cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      {/* ---------- image ---------- */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null;
            img.src = '/plan_images/default.jpg';
          }}
        />
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      {/* ---------- header ---------- */}
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">@{creatorUsername}</p>
      </CardHeader>

      {/* ---------- content ---------- */}
      <CardContent className="flex-grow pt-0">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        )}
      </CardContent>

      {/* ---------- price + button at bottom ---------- */}
      <div className="px-6 pb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">${price}</span>
          {hasDiscount && (
            <span className="text-lg line-through text-muted-foreground">
              ${originalPrice}
            </span>
          )}
        </div>
        <CardFooter className="pt-0 p-0">
          <div onClick={(e) => e.stopPropagation()} className="w-full">
            <BuyButton planId={id} />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default PlanCard;
