export interface CreateReviewDto {
  userId: string;
  bookId: string;
  title: string;
  content: string;
  rating: number;
}

export interface UpdateReviewDto {
  title?: string;
  content?: string;
  rating?: number;
}

export interface ReviewResponseDto {
  id: string;
  userId: string;
  userName?: string;
  bookId: string;
  title: string;
  content: string;
  rating: number;
  likes: number;
  dislikes: number;
  hasUserLiked?: boolean;
  hasUserDisliked?: boolean;
  createdAt: Date;
}

export interface PaginatedReviewsDto {
  reviews: ReviewResponseDto[];
  total: number;
  totalPages: number;
  currentPage: number;
}