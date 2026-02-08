import { Author } from "../../domain/entities/Author.js";
import { AuthorFilters } from "../../domain/value-objects/AuthorFilters.js";

export interface IAuthorRepository {
  findById(id: string): Promise<Author | null>;
  findAll(): Promise<Author[]>;
  findFiltered(filters: AuthorFilters): Promise<{ authors: Author[], total: number }>;
  findFeatured(): Promise<Author[]>;
  save(author: Author): Promise<Author>;
  delete(id: string): Promise<void>;
}