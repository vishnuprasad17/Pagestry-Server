import { Banner } from "../../domain/entities/Banner.js";
import { BannerNotFoundError } from "../../domain/errors/BannerErrors.js";
import { UpdateBannerDto } from "../dto/BannerDto.js";
import { IBannerRepository } from "../ports/IBannerRepository.js";
import { IImageStorageService } from "../ports/IImageStorageService.js";

export class UpdateBannerUseCase {
  constructor(
    private readonly bannerRepository: IBannerRepository,
    private readonly imageStorage: IImageStorageService
  ) {}

  async execute(id: string, dto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.bannerRepository.findById(id);

    if (!banner) {
      throw new BannerNotFoundError(id);
    }

    // Handle image replacement
    if (dto.image && dto.image !== banner.getImage()) {
      const oldImage = banner.getImage();
      if (oldImage) {
        try {
          await this.imageStorage.delete(oldImage);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }
    }

    banner.updateDetails({
      title: dto.title,
      description: dto.description,
      image: dto.image,
      theme: dto.theme,
      link: dto.link
    });

    await this.bannerRepository.save(banner);
    return banner;
  }
}