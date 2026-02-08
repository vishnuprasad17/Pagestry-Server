import { Cart } from "../../domain/entities/Cart.js";
import { BookNotFoundError, InsufficientStockError } from "../../domain/errors/CartErrors.js";
import { IBookRepository } from "../ports/IBookRepository.js";
import { ICartRepository } from "../ports/ICartRepository.js";

export class UpdateCartItemUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async execute(userId: string, bookId: string, quantity: number): Promise<boolean> {
    const book = await this.bookRepository.findById(bookId);
    
    if (!book) {
      throw new BookNotFoundError(bookId);
    }

    if (!book.hasEnoughStock(quantity)) {
      throw new InsufficientStockError(bookId, quantity, book.stock);
    }

    let cart = await this.cartRepository.findByUserId(userId);
    
    if (!cart) {
      cart = new Cart(userId);
    }

    if (cart.hasItem(bookId)) {
      cart.updateItem(bookId, quantity, book.stock);
    } else {
      cart.addItem(bookId, quantity, book.stock);
    }

    await this.cartRepository.save(cart);
    return true;
  }
}