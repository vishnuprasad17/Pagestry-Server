import { CartItem } from "./CartItem.js";

export class Cart {
  constructor(
    public readonly userId: string,
    private items: CartItem[] = []
  ) {}

  getItems(): readonly CartItem[] {
    return [...this.items];
  }

  addItem(bookId: string, quantity: number, availableStock: number): void {
    const existingItem = this.items.find(item => item.bookId === bookId);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      existingItem.updateQuantity(
        Math.min(newQuantity, availableStock),
        availableStock
      );
    } else {
      const item = new CartItem(bookId, Math.min(quantity, availableStock));
      if (item.isValidForStock(availableStock)) {
        this.items.push(item);
      }
    }
  }

  updateItem(bookId: string, quantity: number, availableStock: number): void {
    const item = this.items.find(i => i.bookId === bookId);
    
    if (!item) {
      throw new Error("Item not found in cart");
    }
    
    item.updateQuantity(quantity, availableStock);
  }

  removeItem(bookId: string): void {
    this.items = this.items.filter(item => item.bookId !== bookId);
  }

  clear(): void {
    this.items = [];
  }

  hasItem(bookId: string): boolean {
    return this.items.some(item => item.bookId === bookId);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}