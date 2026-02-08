import { InvalidCartItemDataError, CartItemStockExceededError } from "../errors/CartErrors.js";

export class CartItem {
  constructor(
    public readonly bookId: string,
    public quantity: number
  ) {}

  static create(data: {
    bookId: string;
    quantity: number;
  }): CartItem {
    // Validate on creation
    if (!data.bookId || data.bookId.trim().length === 0) {
      throw new InvalidCartItemDataError("Book ID is required");
    }
    if (data.quantity < 1) {
      throw new InvalidCartItemDataError("Quantity must be at least 1");
    }

    return new CartItem(data.bookId, data.quantity);
  }

  static reconstitute(data: {
    bookId: string;
    quantity: number;
  }): CartItem {
    return new CartItem(data.bookId, data.quantity);
  }

  isValidForStock(availableStock: number): boolean {
    return this.quantity <= availableStock;
  }

  updateQuantity(newQuantity: number, maxStock: number): void {
    if (newQuantity < 1) {
      throw new InvalidCartItemDataError("Quantity must be at least 1");
    }
    if (newQuantity > maxStock) {
      throw new CartItemStockExceededError(maxStock, newQuantity);
    }
    this.quantity = newQuantity;
  }

  capQuantityToStock(maxStock: number): void {
    if (this.quantity > maxStock) {
      this.quantity = maxStock;
    }
  }
}