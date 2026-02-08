import { CartNotFoundError } from "../../domain/errors/CartErrors.js";
import { ICartRepository } from "../ports/ICartRepository.js";

export class ClearCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new CartNotFoundError(userId);
    }

    cart.clear();
    await this.cartRepository.save(cart);
  }
}