import { Banner } from "../../domain/entities/Banner.js";
import { CreateBannerDto } from "../dto/BannerDto.js";
import { IBannerRepository } from "../ports/IBannerRepository.js";

export class CreateBannerUseCase {
  constructor(private readonly bannerRepository: IBannerRepository) {}

  async execute(dto: CreateBannerDto): Promise<Banner> {
    const banner = Banner.create({
      title: dto.title,
      description: dto.description,
      image: dto.image,
      theme: dto.theme,
      isActive: true,
      link: dto.link
    });

    await this.bannerRepository.save(banner);
    return banner;
  }
}