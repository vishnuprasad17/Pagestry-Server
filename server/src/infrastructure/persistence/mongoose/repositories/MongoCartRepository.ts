import mongoose from "mongoose";
import { ICartRepository } from "../../../../application/ports/ICartRepository.js";
import { CartModel } from "../models/CartModel.js";
import { Cart } from "../../../../domain/entities/Cart.js";
import { CartMapper } from "../mappers/CartMapper.js";

export class MongoCartRepository implements ICartRepository {
  constructor(
    private readonly model: typeof CartModel,
    private readonly session?: mongoose.ClientSession
  ) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    const query = this.model.findOne({ 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (this.session) {
      query.session(this.session);
    }

    const document = await query.exec();
    
    if (!document) {
      return null;
    }

    return CartMapper.toDomain(document);
  }

  async save(cart: Cart): Promise<void> {
    const persistenceData = CartMapper.toPersistence(cart);
    
    const options = this.session ? { session: this.session } : {};
    
    await this.model.findOneAndUpdate(
      { userId: persistenceData.userId },
      { $set: { items: persistenceData.items } },
      { upsert: true, ...options }
    );
  }

  async delete(userId: string): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await this.model.deleteOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      options
    );
  }

  async clearCart(userId: string): Promise<void> {
    await this.model.updateOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { items: [] } },
      { session: this.session || undefined }
    );
  }
}