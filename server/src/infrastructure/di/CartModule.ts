import { IBookRepository } from "../../application/ports/IBookRepository.js";
import { ICartRepository } from "../../application/ports/ICartRepository.js";
import { IUnitOfWork } from "../../application/ports/IUnitOfWork.js";
import { GetCartUseCase } from "../../application/use-cases/GetCartUseCase.js";
import { MergeGuestCartUseCase } from "../../application/use-cases/MergeGuestCartUseCase.js";
import { RemoveCartItemUseCase } from "../../application/use-cases/RemoveCartItemUseCase.js";
import { UpdateCartItemUseCase } from "../../application/use-cases/UpdateCartItemUseCase.js";
import { ValidateCartStockUseCase } from "../../application/use-cases/ValidateCartStockUseCase.js";
import { ClearCartUseCase } from "../../application/use-cases/ClearCartUseCase.js";
import { CartController } from "../../interface-adapters/controllers/CartController.js";
import { MongoUnitOfWork } from "../persistence/mongoose/MongoUnitOfWork.js";
import { BookModel } from "../persistence/mongoose/models/BookModel.js";
import { CartModel } from "../persistence/mongoose/models/CartModel.js";
import { MongoBookRepository } from "../persistence/mongoose/repositories/MongoBookRepository.js";
import { MongoCartRepository } from "../persistence/mongoose/repositories/MongoCartRepository.js";

export class CartModule {
  private static cartRepository: ICartRepository;
  private static bookRepository: IBookRepository;

  static getCartRepository(): ICartRepository {
    if (!this.cartRepository) {
      this.cartRepository = new MongoCartRepository(CartModel);
    }
    return this.cartRepository;
  }

  static getBookRepository(): IBookRepository {
    if (!this.bookRepository) {
      this.bookRepository = new MongoBookRepository(BookModel);
    }
    return this.bookRepository;
  }

  static getUnitOfWork(): IUnitOfWork {
    return new MongoUnitOfWork();
  }

  static getGetCartUseCase(): GetCartUseCase {
    return new GetCartUseCase(
      this.getCartRepository(),
      this.getBookRepository()
    );
  }

  static getUpdateCartItemUseCase(): UpdateCartItemUseCase {
    return new UpdateCartItemUseCase(
      this.getCartRepository(),
      this.getBookRepository()
    );
  }

  static getRemoveCartItemUseCase(): RemoveCartItemUseCase {
    return new RemoveCartItemUseCase(this.getCartRepository());
  }

  static getMergeGuestCartUseCase(): MergeGuestCartUseCase {
    return new MergeGuestCartUseCase(this.getUnitOfWork());
  }

  static getValidateCartStockUseCase(): ValidateCartStockUseCase {
    return new ValidateCartStockUseCase(this.getBookRepository());
  }

  static getClearCartUseCase(): ClearCartUseCase {
    return new ClearCartUseCase(this.getCartRepository());
  }

  static getCartController(): CartController {
    return new CartController(
      this.getGetCartUseCase(),
      this.getUpdateCartItemUseCase(),
      this.getRemoveCartItemUseCase(),
      this.getMergeGuestCartUseCase(),
      this.getValidateCartStockUseCase(),
      this.getClearCartUseCase()
    );
  }
}