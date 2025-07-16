export interface CreatorPreviewDTO {
  id: number;
  username: string;
  subdomain: string;
  plansCount: number;
  rating: Decimal;
  specialties: string[];
  totalSales: number;
  bio?: string;
  coverUrl?: string;
  avatarUrl?: string;
  yearsXP?: Decimal;
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
