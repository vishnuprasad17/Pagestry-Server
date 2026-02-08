import { CartItemDto } from "../dto/CartItemDto.js";
import { ValidationResultDto } from "../dto/ValidationResultDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class ValidateCartStockUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(cartItems: CartItemDto[]): Promise<ValidationResultDto> {
    const outOfStock: string[] = [];

    for (const item of cartItems) {
      const book = await this.bookRepository.findById(item.bookId);
      
      if (!book || !book.hasEnoughStock(item.quantity)) {
        outOfStock.push(item.bookId);
      }
    }

    if (outOfStock.length > 0) {
      return {
        success: false,
        outOfStock
      };
    }

    return { success: true };
  }
}