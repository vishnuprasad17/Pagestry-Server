import { Banner } from "../../../../domain/entities/Banner.js";

export class BannerMapper {
  static toDomain(document: any): Banner {
    return Banner.reconstitute({
      id: document._id.toString(),
      title: document.title,
      description: document.description,
      image: document.image,
      theme: document.theme,
      isActive: document.isActive,
      link: document.link,
      createdAt: document.createdAt
    });
  }

  static toPersistence(banner: Banner): any {
    return {
      title: banner.getTitle(),
      description: banner.getDescription(),
      image: banner.getImage(),
      theme: banner.getTheme(),
      link: banner.getLink(),
      isActive: banner.isActiveBanner()
    };
  }
}