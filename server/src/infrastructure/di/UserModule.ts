import { IBookRepository } from "../../application/ports/IBookRepository.js";
import { ICloudinaryService } from "../../application/ports/ICloudinaryService.js";
import { IImageStorageService } from "../../application/ports/IImageStorageService.js";
import { IUserRepository } from "../../application/ports/IUserRepository.js";
import { AddToWishlistUseCase } from "../../application/use-cases/AddToWishlistUseCase.js";
import { GetCloudinarySignatureUseCase } from "../../application/use-cases/GetCloudinarySignatureUseCase.js";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase.js";
import { GetUsersUseCase } from "../../application/use-cases/GetUsersUseCase.js";
import { GetWishlistUseCase } from "../../application/use-cases/GetWishlistUseCase.js";
import { RemoveFromWishlistUseCase } from "../../application/use-cases/RemoveFromWishlistUseCase.js";
import { UpdateUserUseCase } from "../../application/use-cases/UpdateUserUseCase.js";
import { UserController } from "../../interface-adapters/controllers/UserController.js";
import { BookModel } from "../persistence/mongoose/models/BookModel.js";
import { UserModel } from "../persistence/mongoose/models/UserModel.js";
import { MongoBookRepository } from "../persistence/mongoose/repositories/MongoBookRepository.js";
import { MongoUserRepository } from "../persistence/mongoose/repositories/MongoUserRepository.js";
import { CloudinaryImageStorage } from "../services/CloudinaryImageStorage.js";
import { CloudinaryService } from "../services/CloudinaryService.js";

export class UserModule {
  private static userRepository: IUserRepository;
  private static bookRepository: IBookRepository;
  private static imageStorage: IImageStorageService;
  private static cloudinaryService: ICloudinaryService;

  static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new MongoUserRepository(UserModel);
    }
    return this.userRepository;
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

  static getCloudinaryService(): ICloudinaryService {
    if (!this.cloudinaryService) {
      this.cloudinaryService = new CloudinaryService();
    }
    return this.cloudinaryService;
  }

  static getGetUsersUseCase(): GetUsersUseCase {
    return new GetUsersUseCase(this.getUserRepository());
  }

  static getGetUserByIdUseCase(): GetUserByIdUseCase {
    return new GetUserByIdUseCase(this.getUserRepository());
  }

  static getUpdateUserUseCase(): UpdateUserUseCase {
    return new UpdateUserUseCase(
      this.getUserRepository(),
      this.getImageStorage()
    );
  }

  static getAddToWishlistUseCase(): AddToWishlistUseCase {
    return new AddToWishlistUseCase(
      this.getUserRepository(),
      this.getBookRepository(),
    );
  }

  static getRemoveFromWishlistUseCase(): RemoveFromWishlistUseCase {
    return new RemoveFromWishlistUseCase(this.getUserRepository());
  }

  static getGetWishlistUseCase(): GetWishlistUseCase {
    return new GetWishlistUseCase(
      this.getUserRepository(),
      this.getBookRepository(),
    );
  }

  static getGetCloudinarySignatureUseCase(): GetCloudinarySignatureUseCase {
    return new GetCloudinarySignatureUseCase(this.getCloudinaryService());
  }

  static getUserController(): UserController {
    return new UserController(
      this.getGetUsersUseCase(),
      this.getGetUserByIdUseCase(),
      this.getUpdateUserUseCase(),
      this.getAddToWishlistUseCase(),
      this.getRemoveFromWishlistUseCase(),
      this.getGetWishlistUseCase(),
      this.getGetCloudinarySignatureUseCase(),
    );
  }
}