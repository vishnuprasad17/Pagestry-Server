import { AuthorBookDetailDto } from "./BookDto.js";

export interface CreateAuthorDto {
  name: string;
  bio: string;
  profileImage?: string;
  website?: string;
  isFeatured?: boolean;
}

export interface UpdateAuthorDto {
  name?: string;
  bio?: string;
  profileImage?: string;
  website?: string;
  isFeatured?: boolean;
}

export interface AuthorResponseDto {
  id: string;
  name: string;
  bio: string;
  profileImage?: string;
  website?: string;
  isFeatured: boolean;
  createdAt: Date;
}

export interface AuthorListItemDto {
  id: string;
  name: string;
  profileImage?: string;
}

export interface AuthorDetailsDto {
  author: AuthorResponseDto;
  books: AuthorBookDetailDto[];
}

export interface PaginatedAuthorsDto {
  authors: AuthorResponseDto[];
  totalPages: number;
  currentPage: number;
  totalAuthors: number;
}