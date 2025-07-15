// backend/src/features/plans/plan.transformer.ts
import { Plan, Creator, User, Purchase } from '@prisma/client';
import {
  PlanPreview,
  PlanPaidPreveiw,
  PlanContentJSON,
  PlanCreatorData,
} from '@shared/types/plan';

export function toPlanPreview(
  plan: Plan & { creator: Creator & { user: User }; purchases: Purchase[] }
): PlanPreview {
  return {
    id: plan.id,
    title: plan.title,
    slug: plan.slug,
    price: Number(plan.price),
    coverImage: plan.coverImage ?? undefined,
    creatorId: plan.creator.id,
    creatorUsername: plan.creator.user.username,
    creatorSubdomain: plan.creator.subdomain,
    description: plan.description,
    originalPrice:
      plan.originalPrice !== null ? Number(plan.originalPrice) : undefined,
    difficulty: 'beginner', //TODO add in db
    sales: plan.purchases.length, // TODO add in db or calc somehow
    createdAt: plan.createdAt,
    isPublished: plan.isPublished,
  };
}

export function toPaidPlan(
  plan: Plan & {
    creator: Creator & { user: User };
    purchases: Purchase[];
  }
): PlanPaidPreveiw {
  const content = plan.content as unknown as PlanContentJSON | undefined; // TODO USE ZOD TO VALIDATE
  return {
    ...toPlanPreview(plan),
    introVideo: content?.introVideo ?? '',
    totalWeeks: content?.weeks.length ?? 0,
    totalWorkouts:
      content?.weeks.reduce(
        (sum, w) => sum + w.days.filter((d) => d.type === 'workout').length,
        0
      ) ?? 0,
    goals: content?.goals ?? [],
    tags: content?.tags ?? [],
    weeks:
      content?.weeks.map((week) => ({
        id: week.id,
        title: week.title,
        description: week.description,
        days: week.days.map((day) => ({
          id: day.id,
          type: day.type,
          title: day.title,
          duration: day.duration ?? undefined,
          exercises: day.exercises ?? [],
        })),
      })) ?? [],
  };
}

export function toPlanCreatorData(
  plan: Plan & {
    creator: Creator & { user: User };
    purchases: Purchase[];
  }
): PlanCreatorData {
  return {
    ...toPlanPreview(plan),
    revenue: plan.purchases.reduce((sum, p) => sum + Number(p.amount), 0),
  };
}
