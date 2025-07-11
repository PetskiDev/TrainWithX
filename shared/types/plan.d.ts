//public info, preveiw
export interface PlanPreview {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  originalPrice?: number;
  creatorId: number;
  creatorUsername: string;
  creatorSubdomain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

//paid stuff in the json
export interface PlanContentJSON {
  // or just `string` if not strict
  introVideo: string;
  totalWeeks: number;
  totalWorkouts: number;
  goals: string[];
  tags: string[];
  weeks: PlanWeek[];
}

interface PlanPaid extends PlanPreview, PlanContentJSON {}

export interface PlanWeek {
  id: number;
  title: string;
  description: string;
  status: 'locked' | 'current' | 'unlocked';
  days: PlanDay[];
}

export interface PlanDay {
  id: number;
  type: 'workout' | 'nutrition' | 'rest';
  title: string;
  duration?: string; // Only for workouts
  exercises?: Exercise[]; // Optional, only if type === 'workout'
  meals?: Meal[]; // Optional, only if type === 'nutrition'
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

//old version, will remove
export interface CreatePlanDto {
  creatorId: number;
  title: string;
  description: string;
  slug: string; // must be unique per platform
  price: number; // Decimal(10,2) in Prisma schema
  originalPrice?: number; // optional
}
