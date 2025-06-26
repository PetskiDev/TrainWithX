// backend/src/features/plans/plan.transformer.ts
import { Plan, Creator, User } from '../../generated/prisma';
import { PlanPreview, PlanDetail } from '@shared/types/plan';

export function toPlanPreview(
  plan: Plan & { creator: Creator & { user: User } }
): PlanPreview {
  return {
    id: plan.id,
    title: plan.title,
    slug: plan.slug,
    price: Number(plan.price),
    creatorUsername: plan.creator.user.username,
    creatorSubdomain: plan.creator.subdomain,
    //image: plan.image ?? undefined,
    originalPrice:
      plan.originalPrice !== null ? Number(plan.originalPrice) : undefined,
  };
}

export function toPlanDetail(
  plan: Plan & { creator: Creator & { user: User } }
): PlanDetail {
  return {
    ...toPlanPreview(plan),
    description: plan.description,
    markdown: plan.markdown,
    preview: plan.preview,
    createdAt: plan.createdAt.toISOString(),
  };
}
