import { Cart } from "../../domain/entities/Cart.js";

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  save(cart: Cart): Promise<void>;
  delete(userId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
}