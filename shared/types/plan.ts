export interface PlanPreview {
  id: number;
  title: string;
  slug: string;
  price: number;
  creatorUsername: string;
  creatorSubdomain: string;
}

export interface PlanDetail extends PlanPreview {
  description: string;
  markdown: string | null;
  preview: string | null;
  createdAt: string;
}
