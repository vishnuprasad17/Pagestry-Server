import { AuthorNotFoundError } from "../../domain/errors/AuthorErrors.js";
import { AuthorResponseDto } from "../dto/AuthorDto.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";

export class GetAuthorByIdUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(id: string): Promise<AuthorResponseDto> {
    const author = await this.authorRepository.findById(id);

    if (!author) {
      throw new AuthorNotFoundError(id);
    }

    return {
      id: author.id,
      name: author.getName(),
      bio: author.getBio(),
      profileImage: author.getProfileImage(),
      website: author.getWebsite(),
      isFeatured: author.isFeaturedAuthor(),
      createdAt: author.createdAt
    };
  }
}