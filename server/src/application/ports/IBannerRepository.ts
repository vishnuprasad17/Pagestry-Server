import { Banner } from "../../domain/entities/Banner.js";
import { BannerFilters } from "../../domain/value-objects/BannerFilters.js";

export interface IBannerRepository {
  findById(id: string): Promise<Banner | null>;
  findAll(): Promise<Banner[]>;
  findActive(): Promise<Banner[]>;
  findFiltered(filters: BannerFilters): Promise<{ banners: Banner[], total: number }>;
  save(banner: Banner): Promise<Banner>;
  delete(id: string): Promise<void>;
}