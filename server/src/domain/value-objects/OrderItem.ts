export class OrderItem {
  constructor(
    public readonly bookId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly title: string,
    public readonly category: string,
    public readonly coverImage: string
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    if (unitPrice < 0) {
      throw new Error("Price cannot be negative");
    }
  }

  getTotal(): number {
    return this.quantity * this.unitPrice;
  }
}