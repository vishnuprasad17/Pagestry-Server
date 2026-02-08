import { IBookRepository } from "../../application/ports/IBookRepository.js";
import { IImageStorageService } from "../../application/ports/IImageStorageService.js";
import { IOrderRepository } from "../../application/ports/IOrderRepository.js";
import { IUnitOfWork } from "../../application/ports/IUnitOfWork.js";
import { AddRatingUseCase } from "../../application/use-cases/AddRatingUseCase.js";
import { CreateBookUseCase } from "../../application/use-cases/CreateBookUseCase.js";
import { DeleteBookUseCase } from "../../application/use-cases/DeleteBookUseCase.js";
import { DeleteRatingUseCase } from "../../application/use-cases/DeleteRatingUseCase.js";
import { GetAllBooksUseCase } from "../../application/use-cases/GetAllBooksUseCase.js";
import { GetBookByIdUseCase } from "../../application/use-cases/GetBookByIdUseCase.js";
import { GetFeaturedBooksUseCase } from "../../application/use-cases/GetFeaturedBooksUseCase.js";
import { GetFilteredBooksUseCase } from "../../application/use-cases/GetFilteredBooksUseCase.js";
import { GetTrendingBooksUseCase } from "../../application/use-cases/GetTrendingBooksUseCase.js";
import { IncreaseStockUseCase } from "../../application/use-cases/IncreaseStockUseCase.js";
import { ReduceStockUseCase } from "../../application/use-cases/ReduceStockUseCase.js";
import { SearchBooksUseCase } from "../../application/use-cases/SearchBooksUseCase.js";
import { UpdateBookUseCase } from "../../application/use-cases/UpdateBookUseCase.js";
import { UpdateRatingUseCase } from "../../application/use-cases/UpdateRatingUseCase.js";
import { BookController } from "../../interface-adapters/controllers/BookController.js";
import { BookModel } from "../persistence/mongoose/models/BookModel.js";
import { OrderModel } from "../persistence/mongoose/models/OrderModel.js";
import { MongoUnitOfWork } from "../persistence/mongoose/MongoUnitOfWork.js";
import { MongoBookRepository } from "../persistence/mongoose/repositories/MongoBookRepository.js";
import { MongoOrderRepository } from "../persistence/mongoose/repositories/MongoOrderRepository.js";
import { CloudinaryImageStorage } from "../services/CloudinaryImageStorage.js";

export class BookModule {
  private static bookRepository: IBookRepository;
  private static orderRepository: IOrderRepository;
  private static imageStorage: IImageStorageService;
  private static unitOfWork: IUnitOfWork;

  static getBookRepository(): IBookRepository {
    if (!this.bookRepository) {
      this.bookRepository = new MongoBookRepository(BookModel);
    }
    return this.bookRepository;
  }

  static getOrderRepository(): IOrderRepository {
    if (!this.orderRepository) {
      this.orderRepository = new MongoOrderRepository(OrderModel);
    }
    return this.orderRepository;
  }

  static getImageStorage(): IImageStorageService {
    if (!this.imageStorage) {
      this.imageStorage = new CloudinaryImageStorage();
    }
    return this.imageStorage;
  }

  static getUnitOfWork(): IUnitOfWork {
    return new MongoUnitOfWork();
  }

  static getCreateBookUseCase(): CreateBookUseCase {
    return new CreateBookUseCase(this.getBookRepository());
  }

  static getGetAllBooksUseCase(): GetAllBooksUseCase {
    return new GetAllBooksUseCase(this.getBookRepository());
  }

  static getGetFilteredBooksUseCase(): GetFilteredBooksUseCase {
    return new GetFilteredBooksUseCase(this.getBookRepository());
  }

  static getSearchBooksUseCase(): SearchBooksUseCase {
    return new SearchBooksUseCase(this.getBookRepository());
  }

  static getGetBookByIdUseCase(): GetBookByIdUseCase {
    return new GetBookByIdUseCase(this.getBookRepository());
  }

  static getGetFeaturedBooksUseCase(): GetFeaturedBooksUseCase {
    return new GetFeaturedBooksUseCase(this.getBookRepository());
  }

  static getGetTrendingBooksUseCase(): GetTrendingBooksUseCase {
    return new GetTrendingBooksUseCase(this.getOrderRepository());
  }

  static getUpdateBookUseCase(): UpdateBookUseCase {
    return new UpdateBookUseCase(
      this.getBookRepository(),
      this.getImageStorage()
    );
  }

  static getDeleteBookUseCase(): DeleteBookUseCase {
    return new DeleteBookUseCase(
      this.getBookRepository(),
      this.getImageStorage()
    );
  }

  static getReduceStockUseCase(): ReduceStockUseCase {
    return new ReduceStockUseCase(this.getUnitOfWork());
  }

  static getIncreaseStockUseCase(): IncreaseStockUseCase {
    return new IncreaseStockUseCase(this.getUnitOfWork());
  }

  static getAddRatingUseCase(): AddRatingUseCase {
    return new AddRatingUseCase(this.getUnitOfWork());
  }

  static getUpdateRatingUseCase(): UpdateRatingUseCase {
    return new UpdateRatingUseCase(this.getUnitOfWork());
  }

  static getDeleteRatingUseCase(): DeleteRatingUseCase {
    return new DeleteRatingUseCase(this.getUnitOfWork());
  }

  static getBookController(): BookController {
    return new BookController(
      this.getCreateBookUseCase(),
      this.getGetAllBooksUseCase(),
      this.getGetFilteredBooksUseCase(),
      this.getSearchBooksUseCase(),
      this.getGetBookByIdUseCase(),
      this.getGetFeaturedBooksUseCase(),
      this.getGetTrendingBooksUseCase(),
      this.getUpdateBookUseCase(),
      this.getDeleteBookUseCase()
    );
  }
}