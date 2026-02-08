import { Author } from "../../../../domain/entities/Author.js";

export class AuthorMapper {
  static toDomain(document: any): Author {
    return Author.reconstitute({
      id: document._id.toString(),
      name: document.name,
      bio: document.bio,
      profileImage: document.profileImage,
      website: document.website,
      isFeatured: document.isFeatured,
      createdAt: document.createdAt
    });
  }

  static toPersistence(author: Author): any {
    return {
      name: author.getName(),
      bio: author.getBio(),
      profileImage: author.getProfileImage(),
      website: author.getWebsite(),
      isFeatured: author.isFeaturedAuthor()
    };
  }
}