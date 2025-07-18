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
  avgRating: Decimal;
  noReviews: number;
  creatorUsername: string;
  creatorSubdomain: string;
  totalWorkouts: number;
  duration: number;
  features: string[];
  createdAt: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sales: number;
  weeksInfo: PlanWeekInfo[];
}

//paid stuff in the json
export interface PlanContentJSON {
  // or just `string` if not strict
  introVideo?: string;
  totalWeeks: number;
  goals: string[];
  tags: string[];
  weeks: PlanWeek[];
}

export interface PlanPaidPreveiw extends PlanPreview, PlanContentJSON {}

export interface PlanWithRevenue extends PlanPreview {
  revenue: number;
}

//FIX THIS AS NEW TYPE IMMIDIATELY
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
  | 'weeksInfo'
  | 'avgRating'
  | 'noReviews'
  | 'duration'
  | 'features'
>; //TODO SEPERATE THIS INTO DIFFERENT DATA TYPE AND MAKE DIFFERENT HIEARACHY. THOSE ARE ALL AFTER-CALCULATED VALUES WHICH STRART OFF AT 0 BY DEFAULT

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
