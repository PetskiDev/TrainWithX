// backend/src/features/plans/plan.transformer.ts
import { Plan, Creator, User, Purchase, Completion } from '@prisma/client';
import {
  PlanPreview,
  PlanPaidPreveiw,
  PlanContentJSON,
  PlanWithRevenue,
  PlanWeekInfo,
} from '@shared/types/plan';

function extractPlanWeekInfo(content?: PlanContentJSON): PlanWeekInfo[] {
  if (!content) {
    return [];
  }
  return content.weeks.map((week) => ({
    id: week.id,
    title: week.title,
    description: week.description,
    emoj: '🆕',
  }));
}

export function toPlanPreview(
  plan: Plan & { creator: Creator & { user: User }; purchases: Purchase[] }
): PlanPreview {
  const content = plan.content as unknown as PlanContentJSON | undefined; // TODO USE ZOD TO VALIDATE

  return {
    id: plan.id,
    title: plan.title,
    slug: plan.slug,
    price: Number(plan.price),
    coverImage: plan.coverImage ?? undefined,
    description: plan.description,
    originalPrice:
      plan.originalPrice !== null ? Number(plan.originalPrice) : undefined,
    difficulty: plan.difficulty ?? 'beginner', //TODO MAKE IT NOT NULL IN DB
    duration: content?.weeks.length ?? 0,
    sales: plan.purchases.length, // TODO add in db or calc somehow
    createdAt: plan.createdAt,
    isPublished: plan.isPublished,
    features: plan.features,
    weeksInfo: extractPlanWeekInfo(content),
    totalWorkouts:
      content?.weeks.reduce(
        (sum, w) => sum + w.days.filter((d) => d.type === 'workout').length,
        0
      ) ?? 0,
    avgRating: plan.avgRating,
    noReviews: plan.noReviews,
    tags: plan.tags,


    creatorId: plan.creator.id,
    creatorUsername: plan.creator.user.username,
    creatorSubdomain: plan.creator.subdomain,
    creatorAvatarUrl: plan.creator.user.avatarUrl ?? '',
    creatorXp: plan.creator.yearsXP ?? 0,
  };
}

export function toPaidPlan(
  plan: Plan & {
    creator: Creator & { user: User };
    purchases: Purchase[];
  },
  completedSet: Set<string> // Keys like `${weekId}-${dayId}`
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
    weeks:
      content?.weeks.map((week) => ({
        id: week.id,
        title: week.title,
        emoj: week.emoj, //TODO IN DB SAVE GET FROM CONENT
        description: week.description,
        days: week.days.map((day) => ({
          id: day.id,
          type: day.type,
          title: day.title,
          duration: day.duration ?? undefined,
          exercises: day.exercises ?? [],
          completed: completedSet.has(`${week.id}-${day.id}`)
        })),
      })) ?? [],
  };
}

export function toPlanCreatorData(
  plan: Plan & {
    creator: Creator & { user: User };
    purchases: Purchase[];
  }
): PlanWithRevenue {
  return {
    ...toPlanPreview(plan),
    revenue: plan.purchases.reduce((sum, p) => sum + Number(p.amount), 0),
  };
}
