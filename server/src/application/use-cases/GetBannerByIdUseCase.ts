import { BannerNotFoundError } from "../../domain/errors/BannerErrors.js";
import { BannerResponseDto } from "../dto/BannerDto.js";
import { IBannerRepository } from "../ports/IBannerRepository.js";

export class GetBannerByIdUseCase {
  constructor(private readonly bannerRepository: IBannerRepository) {}

  async execute(id: string): Promise<BannerResponseDto> {
    const banner = await this.bannerRepository.findById(id);

    if (!banner) {
      throw new BannerNotFoundError(id);
    }

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