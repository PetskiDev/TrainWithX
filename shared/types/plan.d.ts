export interface PlanPreview {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  //image?: string; //SLUG IS USED AS LINK TO IMAGE IF IT EXCISTS. NOT USED FOR NOW
  originalPrice?: number;
  creatorUsername: string;
  creatorSubdomain: string;
}

export interface CreatePlanDto {
  creatorId: number;
  title: string;
  description: string;
  slug: string; // must be unique per platform
  price: number; // Decimal(10,2) in Prisma schema
  originalPrice?: number; // optional
}

export interface PlanDetail extends PlanPreview {
  description: string;
  markdown: string | null;
  preview: string | null;
  createdAt: string;
}
