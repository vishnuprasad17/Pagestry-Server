import { BannerResponseDto } from "../dto/BannerDto.js";
import { IBannerRepository } from "../ports/IBannerRepository.js";

export class GetActiveBannersUseCase {
  constructor(private readonly bannerRepository: IBannerRepository) {}

  async execute(): Promise<BannerResponseDto[]> {
    const banners = await this.bannerRepository.findActive();
    
    return banners.map(banner => ({
      id: banner.id,
      title: banner.getTitle(),
      description: banner.getDescription(),
      image: banner.getImage(),
      theme: banner.getTheme(),
      link: banner.getLink(),
      isActive: banner.isActiveBanner(),
      createdAt: banner.createdAt
    }));
  }
}