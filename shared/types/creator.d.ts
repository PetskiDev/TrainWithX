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
  profileViews: number;
}

export interface CreatorFullDTO extends CreatorPreviewDTO {
  totalRevenue: number;
  revenueThisMonth: number;
}



export interface CreatorPostDTO {
  username?: string;
  bio?: string;
  specialties?: string[];
  yearsXP?: Decimal;
}

export interface SendApplicationDTO {
  email: string;
  fullName: string;
  subdomain: string;
  specialties: string[];
  experience: Decimal;
  bio: string;
  certifications?: string;
  socialMedia?: string;
  agreeToTerms: boolean;
}


export interface CreatorApplicationDTO extends SendApplicationDTO {
  id: number;
  createdAt: Date;
  userId: number;
  avatarUrl?: string; //derived from suer
  username: string; //derived
  status: 'pending' | 'approved' | 'rejected';
}
