// backend/src/features/plans/plan.transformer.ts
import { Plan, Creator, User } from '@prisma/client';
import {
  PlanPreview,
  PlanPaid,
  PlanContentJSON,
} from '@shared/types/plan';

export function toPlanPreview(
  plan: Plan & { creator: Creator & { user: User } }
): PlanPreview {
  return {
    id: plan.id,
    title: plan.title,
    slug: plan.slug,
    price: Number(plan.price),
    creatorId: plan.creator.id,
    creatorUsername: plan.creator.user.username,
    creatorSubdomain: plan.creator.subdomain,
    description: plan.description,
    difficulty: 'beginner',
    originalPrice:
      plan.originalPrice !== null ? Number(plan.originalPrice) : undefined,
  };
}

export function toPaidPlan(
  plan: Plan & {
    creator: Creator & { user: User };
  }
): PlanPaid {
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
    weeks: content?.weeks.map((week) => ({
      id: week.id,
      title: week.title,
      description: week.description,
      status: week.status, // 'locked' | 'current' | 'unlocked'
      days: week.days.map((day) => ({
        id: day.id,
        type: day.type,
        title: day.title,
        duration: day.duration ?? undefined,
        exercises: day.exercises ?? [],
        meals: day.meals ?? [],
      })),
    })) ?? [],
  };
}
