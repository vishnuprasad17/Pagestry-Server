import mongoose from "mongoose";
import { IAdminUnitOfWork } from "../../../application/ports/IUnitOfWork.js";
import { IOrderRepository } from "../../../application/ports/IOrderRepository.js";
import { IBookRepository } from "../../../application/ports/IBookRepository.js";
import { MongoOrderRepository } from "./repositories/MongoOrderRepository.js";
import { OrderModel } from "./models/OrderModel.js";
import { BookModel } from "./models/BookModel.js";
import { MongoBookRepository } from "./repositories/MongoBookRepository.js";

export class MongoAdminUnitOfWork implements IAdminUnitOfWork {
  private session: mongoose.ClientSession | null = null;
  private orderRepo: IOrderRepository | null = null;
  private bookRepo: IBookRepository | null = null;

  async begin(): Promise<void> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    // Reset repositories to force recreation with new session
    this.orderRepo = null;
    this.bookRepo = null;
  }

  async commit(): Promise<void> {
    if (!this.session) {
      throw new Error("Transaction not started");
    }
    
    if (!this.session.inTransaction()) {
      throw new Error("No active transaction to commit");
    }
    
    try {
      await this.session.commitTransaction();
    } finally {
      await this.session.endSession();
      this.session = null;
      this.orderRepo = null;
      this.bookRepo = null;
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
      this.bookRepo = null;
    }
  }

  getOrderRepository(): IOrderRepository {
    if (!this.session) {
      throw new Error("Transaction not started. Call begin() first.");
    }
    
    if (!this.orderRepo) {
      this.orderRepo = new MongoOrderRepository(OrderModel, this.session);
    }
    return this.orderRepo;
  }

  getBookRepository(): IBookRepository {
    if (!this.session) {
      throw new Error("Transaction not started. Call begin() first.");
    }
    
    if (!this.bookRepo) {
      this.bookRepo = new MongoBookRepository(BookModel, this.session);
    }
    return this.bookRepo;
  }
}