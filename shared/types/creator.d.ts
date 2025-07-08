export interface CreatorPreviewDTO {
  id: number;
  username: string;
  subdomain: string;
  plansCount: number;
  rating: Decimal;
  noBuys: number;
  bio?: string;
  coverUrl?: string;
  avatarUrl?: string;
  yearsXP?: Decimal;
}
