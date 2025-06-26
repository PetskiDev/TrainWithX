export interface PlanPreview {
  id: number;
  title: string;
  slug: string;
  price: number;
  //image?: string; //SLUG IS USED AS LINK TO IMAGE IF IT EXCISTS. NOT USED FOR NOW
  originalPrice?: number;
  creatorUsername: string;
  creatorSubdomain: string;
}

export interface PlanDetail extends PlanPreview {
  description: string;
  markdown: string | null;
  preview: string | null;
  createdAt: string;
}
