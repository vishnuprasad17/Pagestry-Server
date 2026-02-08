import { AuthorNotFoundError } from "../../domain/errors/AuthorErrors.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";
import { IImageStorageService } from "../ports/IImageStorageService.js";

export class DeleteAuthorUseCase {
  constructor(
    private readonly authorRepository: IAuthorRepository,
    private readonly imageStorage: IImageStorageService
  ) {}

  async execute(id: string): Promise<void> {
    const author = await this.authorRepository.findById(id);

    if (!author) {
      throw new AuthorNotFoundError(id);
    }

    // Delete profile image if exists
    const profileImage = author.getProfileImage();
    if (profileImage) {
      try {
        await this.imageStorage.delete(profileImage);
      } catch (error) {
        console.error('Failed to delete image:', error);
        // Don't throw - continue with deletion
      }
    }

    await this.authorRepository.delete(id);
  }
}