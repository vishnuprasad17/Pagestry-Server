import { DomainError } from "./DomainError.js";

export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, 404);
    this.name = 'UserNotFoundError';
  }
}

export class UserBlockedError extends DomainError {
  constructor() {
    super("User account is blocked", 403);
    this.name = 'UserBlockedError';
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid username or password", 401);
    this.name = 'InvalidCredentialsError';
  }
}

export class FirebaseUserDisabledError extends DomainError {
  constructor() {
    super("Firebase user account is disabled", 401);
    this.name = 'FirebaseUserDisabledError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}