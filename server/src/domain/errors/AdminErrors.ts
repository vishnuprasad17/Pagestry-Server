import { OrderStatus } from "../value-objects/OrderFilters.js";
import { DomainError } from "./DomainError.js";

export class InvalidStatusTransitionError extends DomainError {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Cannot transition from ${from} to ${to}`, 400);
    this.name = 'InvalidStatusTransitionError';
  }
}

export class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super(`Order not found: ${orderId}`, 404);
    this.name = 'OrderNotFoundError';
  }
}

export class RefundNotAllowedError extends DomainError {
  constructor(reason: string) {
    super(`Refund not allowed: ${reason}`, 400);
    this.name = 'RefundNotAllowedError';
  }
}

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User not found: ${userId}`, 404);
    this.name = 'UserNotFoundError';
  }
}

export class CannotBlockAdminError extends DomainError {
  constructor() {
    super("Cannot block admin users", 400);
    this.name = 'CannotBlockAdminError';
  }
}