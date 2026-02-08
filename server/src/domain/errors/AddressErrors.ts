import { AddressLimit } from "../value-objects/AddressLimit.js";
import { DomainError } from "./DomainError.js";

export class AddressNotFoundError extends DomainError {
  constructor(addressId: string) {
    super(`Address not found: ${addressId}`, 404);
    this.name = 'AddressNotFoundError';
  }
}

export class AddressLimitExceededError extends DomainError {
  constructor() {
    super(`You can add only ${AddressLimit.getMaxAddresses()} addresses`, 400);
    this.name = 'AddressLimitExceededError';
  }
}

export class DefaultAddressRequiredError extends DomainError {
  constructor() {
    super("At least one default address is required", 400);
    this.name = 'DefaultAddressRequiredError';
  }
}

export class UnauthorizedAccessError extends DomainError {
  constructor() {
    super("You are not authorized to access this address", 403);
    this.name = 'UnauthorizedAccessError';
  }
}

export class InvalidAddressDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidAddressDataError';
  }
}