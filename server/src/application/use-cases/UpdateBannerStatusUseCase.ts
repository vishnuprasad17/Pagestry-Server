import { Banner } from "../../domain/entities/Banner.js";
import { BannerNotFoundError } from "../../domain/errors/BannerErrors.js";
import { IBannerRepository } from "../ports/IBannerRepository.js";

export class UpdateBannerStatusUseCase {
  constructor(private readonly bannerRepository: IBannerRepository) {}

  async execute(id: string, isActive: boolean): Promise<Banner> {
    const banner = await this.bannerRepository.findById(id);

    if (!banner) {
      throw new BannerNotFoundError(id);
    }

    if (isActive) {
      banner.activate();
    } else {
      banner.deactivate();
    }

    await this.bannerRepository.save(banner);
    return banner;
  }
}