import { DomainError } from "./DomainError.js";

export class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super(`Order not found: ${orderId}`, 404);
    this.name = 'OrderNotFoundError';
  }
}

export class InvalidOrderStateError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidOrderStateError';
  }
}

export class PaymentVerificationError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'PaymentVerificationError';
  }
}

export class InsufficientStockError extends DomainError {
  constructor(public readonly outOfStockIds: string[]) {
    super(`Items out of stock: ${outOfStockIds.join(', ')}`, 400);
    this.name = 'InsufficientStockError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class DuplicateOrderError extends DomainError {
  constructor(idempotencyKey: string) {
    super(`Order with idempotency key ${idempotencyKey} already exists`, 400);
    this.name = 'DuplicateOrderError';
  }
}