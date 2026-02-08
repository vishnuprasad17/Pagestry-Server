import { PaymentMethod, PaymentStatus } from "./PaymentDetails.js";

export type OrderStatus = "PENDING" | "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED";

export class OrderFilters {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly status?: OrderStatus,
    public readonly paymentStatus?: PaymentStatus,
    public readonly paymentMethod?: PaymentMethod,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly searchQuery?: string
  ) {
    if (page < 1) throw new Error("Page must be at least 1");
    if (limit < 1) throw new Error("Limit must be at least 1");
  }

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }
}