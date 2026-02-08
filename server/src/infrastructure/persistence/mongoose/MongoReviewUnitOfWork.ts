import mongoose from "mongoose";
import { IReviewUnitOfWork } from "../../../application/ports/IUnitOfWork.js";
import { IReviewRepository } from "../../../application/ports/IReviewRepository.js";
import { IUserRepository } from "../../../application/ports/IUserRepository.js";
import { IBookRepository } from "../../../application/ports/IBookRepository.js";
import { MongoReviewRepository } from "./repositories/MongoReviewRepository.js";
import { MongoBookRepository } from "./repositories/MongoBookRepository.js";
import { BookModel } from "./models/BookModel.js";
import { ReviewModel } from "./models/ReviewModel.js";
import { UserModel } from "./models/UserModel.js";
import { MongoUserRepository } from "./repositories/MongoUserRepository.js";

export class MongoReviewUnitOfWork implements IReviewUnitOfWork {
  private session: mongoose.ClientSession | null = null;
  private reviewRepo: IReviewRepository | null = null;
  private userRepo: IUserRepository | null = null;
  private bookRepo: IBookRepository | null = null;

  async begin(): Promise<void> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    // Reset repositories to force recreation with new session
    this.reviewRepo = null;
    this.userRepo = null;
    this.bookRepo = null;
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
      this.reviewRepo = null;
      this.userRepo = null;
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
      this.reviewRepo = null;
      this.userRepo = null;
      this.bookRepo = null;
    }
  }

  getReviewRepository(): IReviewRepository {
    if (!this.reviewRepo) {
      this.reviewRepo = new MongoReviewRepository(
        ReviewModel,
        this.session || undefined
      );
    }
    return this.reviewRepo;
  }

  getUserRepository(): IUserRepository {
    if (!this.userRepo) {
      this.userRepo = new MongoUserRepository(
        UserModel,
        this.session || undefined
      );
    }
    return this.userRepo;
  }

  getBookRepository(): IBookRepository {
    if (!this.bookRepo) {
      this.bookRepo = new MongoBookRepository(
        BookModel,
        this.session || undefined
      );
    }
    return this.bookRepo;
  }
}