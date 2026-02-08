import { Author } from "../../domain/entities/Author.js";
import { CreateAuthorDto } from "../dto/AuthorDto.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";

export class CreateAuthorUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(dto: CreateAuthorDto): Promise<Author> {
    const author = Author.create({
      name: dto.name,
      bio: dto.bio,
      profileImage: dto.profileImage,
      website: dto.website,
      isFeatured: dto.isFeatured || false
    });

    await this.authorRepository.save(author);
    return author;
  }
}