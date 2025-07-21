export interface ReviewPreviewDTO {
  id: number;
  userId: number;
  planId: number;
  comment: string;
  rating: number;
  createdAt: Date;
}
export interface CreatorPageReviewDTO extends ReviewPreviewDTO {
  planTitle: string; //derived
  userAvatar: string;
  userUsername: string;
}

export interface CreateReviewDTO {
  rating: number; // 1 to 5
  comment?: string; // optional text
  planId: number;
}

export type UpdateReviewDTO = Partial<Omit<CreateReviewDTO, 'planId'>> & {
  planId: number;
};
