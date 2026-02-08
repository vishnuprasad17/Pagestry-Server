import { Cart } from "../../domain/entities/Cart.js";
import { CartItemDto } from "../dto/CartItemDto.js";
import { IUnitOfWork } from "../ports/IUnitOfWork.js";

export class MergeGuestCartUseCase {
  constructor(
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, guestCartItems: CartItemDto[]): Promise<Cart> {
    await this.unitOfWork.begin();

    try {
      const cartRepo = this.unitOfWork.getCartRepository();
      const bookRepo = this.unitOfWork.getBookRepository();

      let cart = await cartRepo.findByUserId(userId);
      
      if (!cart) {
        cart = new Cart(userId);
      }

      const bookIds = guestCartItems.map(item => item.bookId);
      const books = await bookRepo.findByIds(bookIds);
      const bookMap = new Map(books.map(book => [book.id, book]));

      for (const guestItem of guestCartItems) {
        const book = bookMap.get(guestItem.bookId);
        
        if (!book || !book.isInStock()) {
          continue;
        }

        cart.addItem(guestItem.bookId, guestItem.quantity, book.stock);
      }

      await cartRepo.save(cart);
      await this.unitOfWork.commit();

      return cart;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}