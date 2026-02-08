import { BannerNotFoundError } from "../../domain/errors/BannerErrors.js";
import { IBannerRepository } from "../ports/IBannerRepository.js";
import { IImageStorageService } from "../ports/IImageStorageService.js";

export class DeleteBannerUseCase {
  constructor(
    private readonly bannerRepository: IBannerRepository,
    private readonly imageStorage: IImageStorageService
  ) {}

  async execute(id: string): Promise<void> {
    const banner = await this.bannerRepository.findById(id);

    if (!banner) {
      throw new BannerNotFoundError(id);
    }

    // Delete banner image
    const image = banner.getImage();
    if (image) {
      try {
        await this.imageStorage.delete(image);
      } catch (error) {
        console.error('Failed to delete image:', error);
        // Don't throw - continue with deletion
      }
    }

    await this.bannerRepository.delete(id);
  }
}