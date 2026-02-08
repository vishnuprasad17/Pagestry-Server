import { Banner } from "../../domain/entities/Banner.js";
import { BannerFilters } from "../../domain/value-objects/BannerFilters.js";
import { BannerResponseDto, PaginatedBannersDto } from "../dto/BannerDto.js";
import { IBannerRepository } from "../ports/IBannerRepository.js";

export class GetFilteredBannersUseCase {
  constructor(private readonly bannerRepository: IBannerRepository) {}

  async execute(
    page: number,
    limit: number,
    sortBy?: string
  ): Promise<PaginatedBannersDto> {
    const filters = new BannerFilters(page, limit, sortBy as any);
    const { banners, total } = await this.bannerRepository.findFiltered(filters);

    return {
      banners: banners.map(this.mapToResponseDto),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalBanners: total
    };
  }

  private mapToResponseDto(banner: Banner): BannerResponseDto {
    return {
      id: banner.id,
      title: banner.getTitle(),
      description: banner.getDescription(),
      image: banner.getImage(),
      theme: banner.getTheme(),
      link: banner.getLink(),
      isActive: banner.isActiveBanner(),
      createdAt: banner.createdAt
    };
  }
}