export interface CreatorPreviewDTO {
  id: number;
  username: string;
  subdomain: string;
  plansCount: number;
  rating: Decimal;
  totalSales: number;
  bio?: string;
  coverUrl?: string;
  avatarUrl?: string;
  yearsXP?: Decimal;
}

export interface CreatorFullDTO extends CreatorPreviewDTO {
  profileViews: number;
}
