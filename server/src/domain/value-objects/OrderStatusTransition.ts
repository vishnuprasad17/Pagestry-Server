import { OrderStatus } from "./OrderFilters.js";

export class OrderStatusTransition {
  private static readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PLACED", "FAILED", "CANCELLED"],
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
    FAILED: []
  };

  static isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
    return this.VALID_TRANSITIONS[from]?.includes(to) || false;
  }

  static getValidTransitions(currentStatus: OrderStatus): OrderStatus[] {
    return this.VALID_TRANSITIONS[currentStatus] || [];
  }
}