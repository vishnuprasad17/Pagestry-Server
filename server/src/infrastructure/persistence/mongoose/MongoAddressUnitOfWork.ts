import mongoose from "mongoose";
import { IAddressUnitOfWork } from "../../../application/ports/IUnitOfWork.js";
import { IAddressRepository } from "../../../application/ports/IAddressRepository.js";
import { MongoAddressRepository } from "./repositories/MongoAddressRepository.js";
import { AddressModel } from "./models/AddressModel.js";

export class MongoAddressUnitOfWork implements IAddressUnitOfWork {
  private session: mongoose.ClientSession | null = null;
  private addressRepo: IAddressRepository | null = null;

  async begin(): Promise<void> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    // Reset repositories to force recreation with new session
    this.addressRepo = null;
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
      this.addressRepo = null;
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
      this.addressRepo = null;
    }
  }

  getAddressRepository(): IAddressRepository {
    if (!this.addressRepo) {
      this.addressRepo = new MongoAddressRepository(
        AddressModel, 
        this.session || undefined
      );
    }
    return this.addressRepo;
  }
}