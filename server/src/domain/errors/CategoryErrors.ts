import { DomainError } from "./DomainError.js";

export class CategoryNotFoundError extends DomainError {
  constructor(categoryId: string) {
    super(`Category not found: ${categoryId}`, 404);
    this.name = 'CategoryNotFoundError';
  }
}

export class InvalidCategoryDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidCategoryDataError';
  }
}