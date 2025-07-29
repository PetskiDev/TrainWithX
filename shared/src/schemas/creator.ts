import { z } from 'zod';

export interface CreatorPreviewDTO {
  id: number;
  username: string;
  subdomain: string;
  plansCount: number;
  avgRating: any;
  noReviews: number;
  specialties: string[];
  yearsXP: number;
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
export const creatorPostSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),

  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),

  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .regex(
      /^[a-z][a-z0-9]*$/,
      'Subdomain must start with a letter and contain only lowercase letters and numbers'
    ),

  instagram: z
    .string()
    .regex(/^@?[\w.]{1,30}$/, 'Instagram handle is invalid')
    .optional(),

  yearsXP: z
    .number('Years of experience is required.')
    .min(0, { message: 'Experience must be at least 0 years.' })
    .max(50, { message: 'Experience cannot exceed 50 years.' }),
  specialties: z.array(z.string()),

  certifications: z.array(z.string()),

  achievements: z.array(z.string()),
});
export type CreatorPostDTO = z.infer<typeof creatorPostSchema>;
export const partialCreatorPostSchema = creatorPostSchema.partial();

export const sendApplicationSchema = z.object({
  email: z.email('Invalid email'),

  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(25, 'Full name must be at less than 25 characters'),

  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .regex(
      /^[a-z][a-z0-9]*$/,
      'Subdomain must start with a letter and contain only lowercase letters and numbers'
    ),
  specialties: z.array(z.string()),
  experience: z.number().min(1).max(50),

  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(1000, 'Bio must be less than 500 characters'),

  socialMedia: z.string().max(200).optional(),

  instagram: z
    .string()
    .regex(/^@?[\w.]{1,30}$/, 'Instagram handle is invalid')
    .optional(),

  agreeToTerms: z.literal(true, 'You must agree to the terms.'),
});

// ✅ TypeScript DTO derived from schema
export type SendApplicationDTO = z.infer<typeof sendApplicationSchema>;

export interface CreatorApplicationDTO extends SendApplicationDTO {
  id: number;
  createdAt: Date;
  userId: number;
  avatarUrl?: string; //derived from suer
  username: string; //derived
  status: 'pending' | 'approved' | 'rejected';
}
