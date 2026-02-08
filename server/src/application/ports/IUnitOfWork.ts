import { IAddressRepository } from "./IAddressRepository.js";
import { IBookRepository } from "./IBookRepository.js";
import { IUserRepository } from "./IUserRepository.js";
import { ICartRepository } from "./ICartRepository.js";
import { IOrderRepository } from "./IOrderRepository.js";
import { IReviewRepository } from "./IReviewRepository.js";

export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getCartRepository(): ICartRepository;
  getBookRepository(): IBookRepository;
}

export interface IOrderUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getOrderRepository(): IOrderRepository;
  getUserRepository(): IUserRepository;
  getBookRepository(): IBookRepository;
  getCartRepository(): ICartRepository;
}

export interface IAddressUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getAddressRepository(): IAddressRepository;
}

export interface IReviewUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getReviewRepository(): IReviewRepository;
  getUserRepository(): IUserRepository;
  getBookRepository(): IBookRepository;
}

export interface IAdminUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getOrderRepository(): IOrderRepository;
  getBookRepository(): IBookRepository;
}