export interface CreatorPreviewDTO {
  id: number;
  username: string;
  subdomain: string;
  plansCount: number;
  avgRating: any;
  noReviews: number;
  specialties: string[];
  yearsXP: any;
  totalSales: number;
  bio: string;
  coverUrl?: string;
  avatarUrl?: string;
  //profileViews: number;
  certifications: string[];
  achievements: string[];
  instagram?: string;
  joinedAt: Date;
}

export interface CreatorFullDTO extends CreatorPreviewDTO {
  totalRevenue: number;
  revenueThisMonth: number;
}


//in frontend, all are present fetched.
//in backend we use Partial of this to recieve and edit
export interface CreatorPostDTO {
  username: string;
  bio: string;
  subdomain: string;
  instagram?: string;
  yearsXP: any;
  specialties: string[];
  certifications: string[];
  achievements: string[];
}

export interface SendApplicationDTO {
  email: string;
  fullName: string;
  subdomain: string;
  specialties: string[];
  experience: any;
  bio: string;
  socialMedia?: string;
  agreeToTerms: boolean;
  instagram?: string;
}


export interface CreatorApplicationDTO extends SendApplicationDTO {
  id: number;
  createdAt: Date;
  userId: number;
  avatarUrl?: string; //derived from suer
  username: string; //derived
  status: 'pending' | 'approved' | 'rejected';
}
