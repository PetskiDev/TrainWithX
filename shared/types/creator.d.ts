export interface CreatorPreviewDTO {
  id: number;
  username: string;
  subdomain: string;
  plansCount: number;
  rating: number;
  noBuys: number;
  bio?: string;
  coverUrl?: string;
  avatarUrl?: string;
}
