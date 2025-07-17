export interface ReviewPreviewDTO{
  userId: number;
  planId: number;
  comment: string;
  rating: number;
  createdAt: Date;
}

export interface CreateReviewDTO {
  rating: number; // 1 to 5
  comment?: string; // optional text
  planId: number;
}

export type UpdateReviewDTO = Partial<Omit<CreateReviewDTO, 'planId'>> & {
  planId: number;
};
