import mongoose from "mongoose";
import { IOrderUnitOfWork } from "../../../application/ports/IUnitOfWork.js";
import { IOrderRepository } from "../../../application/ports/IOrderRepository.js";
import { IBookRepository } from "../../../application/ports/IBookRepository.js";
import { ICartRepository } from "../../../application/ports/ICartRepository.js";
import { MongoOrderRepository } from "./repositories/MongoOrderRepository.js";
import { OrderModel } from "./models/OrderModel.js";
import { MongoBookRepository } from "./repositories/MongoBookRepository.js";
import { BookModel } from "./models/BookModel.js";
import { MongoCartRepository } from "./repositories/MongoCartRepository.js";
import { CartModel } from "./models/CartModel.js";
import { UserModel } from "./models/UserModel.js";
import { IUserRepository } from "../../../application/ports/IUserRepository.js";
import { MongoUserRepository } from "./repositories/MongoUserRepository.js";

export class MongoOrderUnitOfWork implements IOrderUnitOfWork {
  private session: mongoose.ClientSession | null = null;
  private orderRepo: IOrderRepository | null = null;
  private userRepo: IUserRepository | null = null;
  private bookRepo: IBookRepository | null = null;
  private cartRepo: ICartRepository | null = null;

  async begin(): Promise<void> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    // Reset repositories to force recreation with new session
    this.orderRepo = null;
    this.userRepo = null;
    this.bookRepo = null;
    this.cartRepo = null;
  }

  async commit(): Promise<void> {
    if (!this.session) throw new Error("Transaction not started");

    if (!this.session.inTransaction()) {
      throw new Error("No active transaction to commit");
    }
    
    try {
      await this.session.commitTransaction();
    } finally {
      await this.session.endSession();
      this.session = null;
      this.orderRepo = null;
      this.userRepo = null;
      this.bookRepo = null;
      this.cartRepo = null;
    }
  }

  async rollback(): Promise<void> {
    if (!this.session) {
      return;
    }
    
    try {
      if (this.session.inTransaction()) {
        await this.session.abortTransaction();
      }
    } finally {
      await this.session.endSession();
      this.session = null;
      this.orderRepo = null;
      this.userRepo = null;
      this.bookRepo = null;
      this.cartRepo = null;
    }
  }

  getOrderRepository(): IOrderRepository {
    if (!this.orderRepo) {
      this.orderRepo = new MongoOrderRepository(OrderModel, this.session || undefined);
    }
    return this.orderRepo;
  }

  getUserRepository(): IUserRepository {
    if (!this.userRepo) {
      this.userRepo = new MongoUserRepository(UserModel, this.session || undefined);
    }
    return this.userRepo;
  }

  getBookRepository(): IBookRepository {
    if (!this.bookRepo) {
      this.bookRepo = new MongoBookRepository(BookModel, this.session || undefined);
    }
    return this.bookRepo;
  }

  getCartRepository(): ICartRepository {
    if (!this.cartRepo) {
      this.cartRepo = new MongoCartRepository(CartModel, this.session || undefined);
    }
    return this.cartRepo;
  }
}