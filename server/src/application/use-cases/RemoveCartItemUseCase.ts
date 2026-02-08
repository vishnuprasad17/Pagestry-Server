import { CartNotFoundError } from "../../domain/errors/CartErrors.js";
import { ICartRepository } from "../ports/ICartRepository.js";

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string, bookId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);
    
    if (!cart) {
      throw new CartNotFoundError(userId);
    }

    cart.removeItem(bookId);
    await this.cartRepository.save(cart);
  }
}