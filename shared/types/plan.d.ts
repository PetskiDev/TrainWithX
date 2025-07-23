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
  avgRating: Decimal;
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
  creatorXp: Decimal;
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

export interface PlanPaidPreveiw extends PlanPreview, PlanContentJSON { }

export interface PlanWithRevenue extends PlanPreview {
  revenue: number;
}


export type CreatePlanDto = {
  title: string;
  slug: string;
  price: number;
  description: string;
  originalPrice?: number;
  creatorId: number;
  tags: string[];
  features: string[];
  goals: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  weeks: PlanWeek[];
}

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
