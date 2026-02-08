export interface BookResponseDto {
  id: string;
  title: string;
  author?: {
    id: string;
    name: string;
  };
  description: string;
  category?: {
    id: string;
    name: string;
  };
  ISBN: string;
  coverImage: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  featured: boolean;
  averageRating: number;
  ratingCount: number;
  ratingBreakdown: Record<number, number>;
  discountPercentage: number;
  createdAt?: Date;
}

export interface AuthorBookDetailDto {
  id: string;
  title: string;
  coverImage: string;
  category?: {
    id: string;
    name: string;
  };
  mrp: number;
  sellingPrice: number;
  stock: number;
  averageRating: number;
  ratingCount: number;
  discountPercentage: number;
}

export interface FeaturedBookResponseDto {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  averageRating: number;
  ratingCount: number;
  discountPercentage: number;
}

export interface BookListItemDto {
  id: string;
  title: string;
  coverImage: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface TrendingBookDto {
  id: string;
  title: string;
  cover: string;
  trend: number;
}

export interface PaginatedBooksDto {
  books: BookResponseDto[];
  totalPages: number;
  currentPage: number;
  totalBooks: number;
}

export interface CreateBookDto {
  title: string;
  authorId: string;
  description: string;
  categoryId: string;
  ISBN: string;
  featured?: boolean;
  coverImage: string;
  mrp: number;
  sellingPrice: number;
  stock?: number;
}

export interface UpdateBookDto {
  title?: string;
  description?: string;
  categoryId?: string;
  featured?: boolean;
  coverImage?: string;
  mrp?: number;
  sellingPrice?: number;
  stock?: number;
}