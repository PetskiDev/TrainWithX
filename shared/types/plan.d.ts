//public info, preveiw
export interface PlanPreview {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  coverImage?: string;
  originalPrice?: number;
  creatorId: number;
  isPublished: boolean;
  creatorUsername: string;
  creatorSubdomain: string;
  createdAt: DateTime;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sales: number;
}

//paid stuff in the json
export interface PlanContentJSON {
  // or just `string` if not strict
  introVideo?: string;
  totalWeeks: number;
  totalWorkouts: number;
  goals: string[];
  tags: string[];
  weeks: PlanWeek[];
}

export interface PlanPaidPreveiw extends PlanPreview, PlanContentJSON {}

export interface PlanCreatorData extends PlanPreview {
  revenue: number;
}

export type CreatePlanDto = Omit<
  PlanPaidPreveiw,
  | 'id'
  | 'creatorUsername'
  | 'creatorSubdomain'
  | 'totalWeeks'
  | 'totalWorkouts'
  | 'sales'
  | 'createdAt'
  | 'isPublished'
>;

export interface PlanWeek {
  id: number;
  title: string;
  description: string;
  days: PlanDay[];
}

export interface PlanDay {
  id: number;
  type: 'workout' | 'nutrition' | 'rest';
  title: string;
  duration?: string; // Only for workouts
  exercises?: Exercise[]; // Optional, only if type === 'workout'
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
