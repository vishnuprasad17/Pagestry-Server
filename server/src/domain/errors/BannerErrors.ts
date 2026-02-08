import { DomainError } from "./DomainError.js";

export class BannerNotFoundError extends DomainError {
  constructor(bannerId: string) {
    super(`Banner not found: ${bannerId}`, 404);
    this.name = 'BannerNotFoundError';
  }
}

export class InvalidBannerDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidBannerDataError';
  }
}