import mongoose from "mongoose";
import { IUnitOfWork } from "../../../application/ports/IUnitOfWork.js";
import { ICartRepository } from "../../../application/ports/ICartRepository.js";
import { IBookRepository } from "../../../application/ports/IBookRepository.js";
import { CartModel } from "./models/CartModel.js";
import { BookModel } from "./models/BookModel.js";
import { MongoCartRepository } from "./repositories/MongoCartRepository.js";
import { MongoBookRepository } from "./repositories/MongoBookRepository.js";

export class MongoUnitOfWork implements IUnitOfWork {
  private session: mongoose.ClientSession | null = null;
  private cartRepo: ICartRepository | null = null;
  private bookRepo: IBookRepository | null = null;

  async begin(): Promise<void> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    // Reset repositories to force recreation with new session
    this.cartRepo = null;
    this.bookRepo = null
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
      this.cartRepo = null;
      this.bookRepo = null
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
      this.cartRepo = null;
      this.bookRepo = null
    }
  }

  getCartRepository(): ICartRepository {
    if (!this.cartRepo) {
      this.cartRepo = new MongoCartRepository(CartModel, this.session || undefined);
    }
    return this.cartRepo;
  }

  getBookRepository(): IBookRepository {
    if (!this.bookRepo) {
      this.bookRepo = new MongoBookRepository(BookModel, this.session || undefined);
    }
    return this.bookRepo;
  }
}