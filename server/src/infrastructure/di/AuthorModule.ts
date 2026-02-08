import { IAuthorRepository } from "../../application/ports/IAuthorRepository.js";
import { IBookRepository } from "../../application/ports/IBookRepository.js";
import { IImageStorageService } from "../../application/ports/IImageStorageService.js";
import { CreateAuthorUseCase } from "../../application/use-cases/CreateAuthorUseCase.js";
import { DeleteAuthorUseCase } from "../../application/use-cases/DeleteAuthorUseCase.js";
import { GetAllAuthorsUseCase } from "../../application/use-cases/GetAllAuthorsUseCase.js";
import { GetAuthorByIdUseCase } from "../../application/use-cases/GetAuthorByIdUseCase.js";
import { GetAuthorDetailsUseCase } from "../../application/use-cases/GetAuthorDetailsUseCase.js";
import { GetFeaturedAuthorsUseCase } from "../../application/use-cases/GetFeaturedAuthorsUseCase.js";
import { GetFilteredAuthorsUseCase } from "../../application/use-cases/GetFilteredAuthorsUseCase.js";
import { UpdateAuthorUseCase } from "../../application/use-cases/UpdateAuthorUseCase.js";
import { AuthorController } from "../../interface-adapters/controllers/AuthorController.js";
import { AuthorModel } from "../persistence/mongoose/models/AuthorModel.js";
import { BookModel } from "../persistence/mongoose/models/BookModel.js";
import { MongoAuthorRepository } from "../persistence/mongoose/repositories/MongoAuthorRepository.js";
import { MongoBookRepository } from "../persistence/mongoose/repositories/MongoBookRepository.js";
import { CloudinaryImageStorage } from "../services/CloudinaryImageStorage.js";

export class AuthorModule {
  private static authorRepository: IAuthorRepository;
  private static bookRepository: IBookRepository;
  private static imageStorage: IImageStorageService;

  static getAuthorRepository(): IAuthorRepository {
    if (!this.authorRepository) {
      this.authorRepository = new MongoAuthorRepository(AuthorModel);
    }
    return this.authorRepository;
  }

  static getBookRepository(): IBookRepository {
    if (!this.bookRepository) {
      this.bookRepository = new MongoBookRepository(BookModel);
    }
    return this.bookRepository;
  }

  static getImageStorage(): IImageStorageService {
    if (!this.imageStorage) {
      this.imageStorage = new CloudinaryImageStorage();
    }
    return this.imageStorage;
  }

  static getCreateAuthorUseCase(): CreateAuthorUseCase {
    return new CreateAuthorUseCase(this.getAuthorRepository());
  }

  static getGetAllAuthorsUseCase(): GetAllAuthorsUseCase {
    return new GetAllAuthorsUseCase(this.getAuthorRepository());
  }

  static getGetFilteredAuthorsUseCase(): GetFilteredAuthorsUseCase {
    return new GetFilteredAuthorsUseCase(this.getAuthorRepository());
  }

  static getGetFeaturedAuthorsUseCase(): GetFeaturedAuthorsUseCase {
    return new GetFeaturedAuthorsUseCase(this.getAuthorRepository());
  }

  static getGetAuthorByIdUseCase(): GetAuthorByIdUseCase {
    return new GetAuthorByIdUseCase(this.getAuthorRepository());
  }

  static getGetAuthorDetailsUseCase(): GetAuthorDetailsUseCase {
    return new GetAuthorDetailsUseCase(
      this.getAuthorRepository(),
      this.getBookRepository()
    );
  }

  static getUpdateAuthorUseCase(): UpdateAuthorUseCase {
    return new UpdateAuthorUseCase(
      this.getAuthorRepository(),
      this.getImageStorage()
    );
  }

  static getDeleteAuthorUseCase(): DeleteAuthorUseCase {
    return new DeleteAuthorUseCase(
      this.getAuthorRepository(),
      this.getImageStorage()
    );
  }

  static getAuthorController(): AuthorController {
    return new AuthorController(
      this.getCreateAuthorUseCase(),
      this.getGetAllAuthorsUseCase(),
      this.getGetFilteredAuthorsUseCase(),
      this.getGetFeaturedAuthorsUseCase(),
      this.getGetAuthorByIdUseCase(),
      this.getGetAuthorDetailsUseCase(),
      this.getUpdateAuthorUseCase(),
      this.getDeleteAuthorUseCase()
    );
  }
}