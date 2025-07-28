import { z } from 'zod';

//public info, preveiw
export interface PlanPreview {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  image?: string;
  originalPrice?: number;
  creatorId: number;
  isPublished: boolean;
  avgRating: any;
  noReviews: number;
  totalWorkouts: number;
  duration: number;
  features: string[];
  createdAt: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sales: number;
  weeksInfo: PlanWeekInfo[];
  tags: string[];
  //needed in most places. Calculated in transformer
  creatorUsername: string;
  creatorSubdomain: string;
  creatorAvatarUrl: string;
  creatorXp: any;
}

export interface PlanPreviewWithProgress extends PlanPreview {
  progress: number; // 0 to 1 (or use percentage if preferred)
}

//paid stuff in the json
export interface PlanContentJSON {
  // or just `string` if not strict
  introVideo?: string;
  totalWeeks: number;
  goals: string[];
  weeks: PlanWeek[];
}

export interface PlanPaidPreveiw extends PlanPreview, PlanContentJSON {}

export interface PlanWithRevenue extends PlanPreview {
  revenue: number;
}

export const createPlanSchema = z
  .object({
    title: z
      .string()
      .min(5, { message: 'Title must be at least 5 characters long' })
      .max(75, { message: 'Title must be less than 75 characters long' }),
    slug: z
      .string()
      .min(1, { message: 'Slug is required' })
      .max(14, { message: 'Slug must be less than 15 charaacters' })
      .regex(/^[a-z]+$/, {
        message: 'Slug must be lowercase and contain only letters',
      }),
    price: z
      .number('Price must be a number')
      .max(1000, 'Price must be less than 1000$'),
    originalPrice: z
      .number('Original price must be a number')
      .max(1000, 'Original price must be less than 1000$')
      .optional(),
    description: z
      .string()
      .min(1, { message: 'Description is required' })
      .max(1000, 'Description too long (max 1000 characters)'),
    creatorId: z
      .number('Creator ID must be a number')
      .int({ message: 'Creator ID must be an integer' })
      .positive({ message: 'Creator ID must be positive' }),
    tags: z
      .array(z.string(), { message: 'Tags must be a list of strings' })
      .max(10, 'Too many tags'),
    features: z
      .array(z.string(), {
        message: 'Features must be a list of strings',
      })
      .max(5, 'Too many features (<=5)'),
    goals: z
      .array(z.string(), {
        message: 'Goals must be a list of strings',
      })
      .max(8, 'Too many goals (<=8)'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),

    weeks: z.any(), // not validated
  })
  .superRefine((data, ctx) => {
    if (data.originalPrice !== undefined && data.originalPrice <= data.price) {
      ctx.addIssue({
        path: ['originalPrice'],
        message: 'Original price must be greater than price if provided',
      });
    }
  });

export type CreatePlanDto = Omit<z.infer<typeof createPlanSchema>, 'weeks'> & {
  weeks: PlanWeek[];
};

export interface PlanWeek {
  id: number;
  title: string;
  description: string;
  days: PlanDay[];
  emoj: string;
}

export interface PlanWeekInfo {
  id: number;
  title: string;
  description: string;
  emoj: string;
}

export interface PlanDay {
  id: number;
  type: 'workout' | 'nutrition' | 'rest';
  title: string;
  duration?: string; // Only for workouts
  exercises?: Exercise[]; // Optional, only if type === 'workout'
  completed: boolean;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
}
