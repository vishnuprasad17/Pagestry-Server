import { Author } from "../../domain/entities/Author.js";
import { AuthorNotFoundError } from "../../domain/errors/AuthorErrors.js";
import { UpdateAuthorDto } from "../dto/AuthorDto.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";
import { IImageStorageService } from "../ports/IImageStorageService.js";

export class UpdateAuthorUseCase {
  constructor(
    private readonly authorRepository: IAuthorRepository,
    private readonly imageStorage: IImageStorageService
  ) {}

  async execute(id: string, dto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.findById(id);

    if (!author) {
      throw new AuthorNotFoundError(id);
    }

    // Handle image replacement
    if (dto.profileImage && dto.profileImage !== author.getProfileImage()) {
      const oldImage = author.getProfileImage();
      if (oldImage) {
        try {
          await this.imageStorage.delete(oldImage);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }
    }

    author.updateDetails({
      name: dto.name,
      bio: dto.bio,
      profileImage: dto.profileImage,
      website: dto.website,
      isFeatured: dto.isFeatured
    });

    await this.authorRepository.save(author);
    return author;
  }
}