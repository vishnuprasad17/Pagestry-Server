import { Author } from "../../domain/entities/Author.js";
import { AuthorFilters } from "../../domain/value-objects/AuthorFilters.js";
import { AuthorResponseDto, PaginatedAuthorsDto } from "../dto/AuthorDto.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";

export class GetFilteredAuthorsUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(
    page: number,
    limit: number,
    sortBy?: string,
    searchQuery?: string
  ): Promise<PaginatedAuthorsDto> {
    const filters = new AuthorFilters(
      page,
      limit,
      sortBy as any,
      searchQuery
    );

    const { authors, total } = await this.authorRepository.findFiltered(filters);

    return {
      authors: authors.map(this.mapToResponseDto),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalAuthors: total
    };
  }

  private mapToResponseDto(author: Author): AuthorResponseDto {
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