import { BannerTheme } from "../value-objects/BannerTheme.js";
import { InvalidBannerDataError } from "../errors/BannerErrors.js";

export class Banner {
  private constructor(
    public readonly id: string,
    private title: string,
    private description: string,
    private image: string,
    private theme: BannerTheme,
    private isActive: boolean,
    private link?: string,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: {
    title: string;
    description: string;
    image: string;
    theme: BannerTheme;
    isActive?: boolean;
    link?: string;
  }): Banner {
    // Validate on creation
    if (!data.title || data.title.trim().length === 0) {
      throw new InvalidBannerDataError("Banner title is required");
    }
    if (!data.description || data.description.trim().length === 0) {
      throw new InvalidBannerDataError("Banner description is required");
    }
    if (!data.image || data.image.trim().length === 0) {
      throw new InvalidBannerDataError("Banner image is required");
    }
    if (data.link && !Banner.isValidUrl(data.link)) {
      throw new InvalidBannerDataError("Invalid banner link URL");
    }

    return new Banner(
      "",
      data.title,
      data.description,
      data.image,
      data.theme,
      data.isActive ?? false,
      data.link,
      new Date()
    );
  }

  static reconstitute(data: {
    id: string;
    title: string;
    description: string;
    image: string;
    theme: BannerTheme;
    isActive: boolean;
    link?: string;
    createdAt: Date;
  }): Banner {
    return new Banner(
      data.id,
      data.title,
      data.description,
      data.image,
      data.theme,
      data.isActive,
      data.link,
      data.createdAt
    );
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      // If it's a relative path (starts with /), it's valid
      return url.startsWith('/');
    }
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getImage(): string {
    return this.image;
  }

  getTheme(): BannerTheme {
    return this.theme;
  }

  getLink(): string | undefined {
    return this.link;
  }

  isActiveBanner(): boolean {
    return this.isActive;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  updateDetails(updates: {
    title?: string;
    description?: string;
    image?: string;
    theme?: BannerTheme;
    link?: string;
  }): void {
    // Validate each field before updating
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        throw new InvalidBannerDataError("Banner title is required");
      }
      this.title = updates.title;
    }

    if (updates.description !== undefined) {
      if (!updates.description || updates.description.trim().length === 0) {
        throw new InvalidBannerDataError("Banner description is required");
      }
      this.description = updates.description;
    }

    if (updates.image !== undefined) {
      if (!updates.image || updates.image.trim().length === 0) {
        throw new InvalidBannerDataError("Banner image is required");
      }
      this.image = updates.image;
    }

    if (updates.theme !== undefined) {
      this.theme = updates.theme;
    }

    if (updates.link !== undefined) {
      if (updates.link && !Banner.isValidUrl(updates.link)) {
        throw new InvalidBannerDataError("Invalid banner link URL");
      }
      this.link = updates.link;
    }
  }

  hasImage(): boolean {
    return !!this.image;
  }

  hasLink(): boolean {
    return !!this.link;
  }
}