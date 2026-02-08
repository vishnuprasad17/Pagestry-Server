import { InvalidAuthorDataError } from '../errors/AuthorErrors.js';

export class Author {
  private constructor(
    public readonly id: string,
    private name: string,
    private bio: string,
    private profileImage: string | undefined,
    private website: string | undefined,
    private isFeatured: boolean = false,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: {
    name: string;
    bio: string;
    profileImage?: string;
    website?: string;
    isFeatured?: boolean;
  }): Author {
    // Validate on creation
    if (!data.name || data.name.trim().length === 0) {
      throw new InvalidAuthorDataError("Author name is required");
    }
    if (!data.bio || data.bio.trim().length === 0) {
      throw new InvalidAuthorDataError("Author bio is required");
    }
    if (data.website && !Author.isValidUrl(data.website)) {
      throw new InvalidAuthorDataError("Invalid website URL");
    }

    return new Author(
      "",
      data.name,
      data.bio,
      data.profileImage,
      data.website,
      data.isFeatured ?? false,
      new Date()
    );
  }

  static reconstitute(data: {
    id: string;
    name: string;
    bio: string;
    profileImage?: string;
    website?: string;
    isFeatured: boolean;
    createdAt: Date;
  }): Author {
    return new Author(
      data.id,
      data.name,
      data.bio,
      data.profileImage,
      data.website,
      data.isFeatured,
      data.createdAt
    );
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getName(): string {
    return this.name;
  }

  getBio(): string {
    return this.bio;
  }

  getProfileImage(): string | undefined {
    return this.profileImage;
  }

  getWebsite(): string | undefined {
    return this.website;
  }

  isFeaturedAuthor(): boolean {
    return this.isFeatured;
  }

  updateDetails(updates: {
    name?: string;
    bio?: string;
    profileImage?: string;
    website?: string;
    isFeatured?: boolean;
  }): void {
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new InvalidAuthorDataError("Author name is required");
      }
      this.name = updates.name;
    }

    if (updates.bio !== undefined) {
      if (!updates.bio || updates.bio.trim().length === 0) {
        throw new InvalidAuthorDataError("Author bio is required");
      }
      this.bio = updates.bio;
    }

    if (updates.website !== undefined) {
      if (updates.website && !Author.isValidUrl(updates.website)) {
        throw new InvalidAuthorDataError("Invalid website URL");
      }
      this.website = updates.website;
    }

    if (updates.profileImage !== undefined) {
      this.profileImage = updates.profileImage;
    }

    if (updates.isFeatured !== undefined) {
      this.isFeatured = updates.isFeatured;
    }
  }

  toggleFeatured(): void {
    this.isFeatured = !this.isFeatured;
  }

  setFeatured(featured: boolean): void {
    this.isFeatured = featured;
  }

  hasProfileImage(): boolean {
    return !!this.profileImage;
  }

  updateProfileImage(imageUrl: string): void {
    this.profileImage = imageUrl;
  }

  removeProfileImage(): void {
    this.profileImage = undefined;
  }
}