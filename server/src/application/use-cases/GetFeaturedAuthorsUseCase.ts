import { AuthorListItemDto } from "../dto/AuthorDto.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";

export class GetFeaturedAuthorsUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(): Promise<AuthorListItemDto[]> {
    const authors = await this.authorRepository.findFeatured();
    if (!authors) {
      console.log(authors);
    }
    
    return authors.map(author => ({
      id: author.id,
      name: author.getName(),
      profileImage: author.getProfileImage()
    }));
  }
}