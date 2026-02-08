export interface UpdateUserDto {
  name?: string;
  profileImage: string;
}

export interface UserResponseDto {
  id: string;
  firebaseUid?: string;
  name: string;
  username: string;
  role?: string;
  profileImage?: string;
  authProvider?: string;
  isBlocked?: boolean;
  favoriteBooks?: string[];
  createdAt?: Date;
}

export interface UserListItemDto {
  id: string;
  firebaseUid?: string;
  name: string;
  username: string;
  isBlocked: boolean;
  createdAt: Date;
}

export interface PaginatedUsersDto {
  users: UserListItemDto[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

export interface WishlistItemDto {
  id: string;
  title: string;
  coverImage: string;
  sellingPrice: number;
  mrp: number;
  stock: number;
}