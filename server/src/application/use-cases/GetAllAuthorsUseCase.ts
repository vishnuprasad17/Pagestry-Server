import { AuthorListItemDto } from "../dto/AuthorDto.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";

export class GetAllAuthorsUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(): Promise<AuthorListItemDto[]> {
    const authors = await this.authorRepository.findAll();
    
    return authors.map(author => ({
      id: author.id,
      name: author.getName(),
      profileImage: author.getProfileImage()
    }));
  }
}