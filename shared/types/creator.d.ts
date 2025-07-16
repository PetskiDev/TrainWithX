export interface CreatorPreviewDTO {
  id: number;
  username: string;
  subdomain: string;
  plansCount: number;
  avgRating: Decimal;
  noReviews: number;
  specialties: string[];
  yearsXP: Decimal;
  totalSales: number;
  bio: string;
  coverUrl?: string;
  avatarUrl?: string;
}

export interface CreatorFullDTO extends CreatorPreviewDTO {
  profileViews: number;
  totalRevenue: number;
  revenueThisMonth: number;
}

export interface SendApplicationDTO {
  fullName: string;
  subdomain: string;
  specialization: string;
  experience: string;
  bio: string;
  certifications?: string;
  socialMedia?: string;
  agreeToTerms: boolean;
  email: string;
}

export interface CreatorPostDTO {
  username?: string;
  bio?: string;
  specialties?: string[];
  yearsXP?: Decimal;
}

export interface CreatorApplicationDTO extends SendApplicationDTO {
  id: number;
  createdAt: Date;
}
