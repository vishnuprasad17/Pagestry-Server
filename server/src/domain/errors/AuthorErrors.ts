import { DomainError } from "./DomainError.js";

export class AuthorNotFoundError extends DomainError {
  constructor(authorId: string) {
    super(`Author not found: ${authorId}`, 404);
    this.name = 'AuthorNotFoundError';
  }
}

export class InvalidAuthorDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidAuthorDataError';
  }
}