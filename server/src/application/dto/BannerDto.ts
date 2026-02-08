import { BannerTheme } from "../../domain/value-objects/BannerTheme.js";

export interface CreateBannerDto {
  title: string;
  description: string;
  image: string;
  theme: BannerTheme;
  link?: string;
}

export interface UpdateBannerDto {
  title?: string;
  description?: string;
  image?: string;
  theme?: BannerTheme;
  link?: string;
}

export interface BannerResponseDto {
  id: string;
  title: string;
  description: string;
  image: string;
  theme: BannerTheme;
  link?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PaginatedBannersDto {
  banners: BannerResponseDto[];
  totalPages: number;
  currentPage: number;
  totalBanners: number;
}