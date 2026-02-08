import mongoose from "mongoose";
import { IUserRepository } from "../../../../application/ports/IUserRepository.js";
import { User } from "../../../../domain/entities/User.js";
import { UserMapper } from "../mappers/UserMapper.js";
import { UserModel } from "../models/UserModel.js";
import { UserFilters } from "../../../../domain/value-objects/UserFilters.js";

export class MongoUserRepository implements IUserRepository {
  constructor(
    private readonly model: typeof UserModel,
    private readonly session?: mongoose.ClientSession
  ) {}

  async findById(id: string): Promise<User | null> {
    const document = await this.model.findById(id).exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const document = await this.model.findOne({ username }).select("+password").exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const query = this.model.findOne({ firebaseUid })
    if (this.session) query.session(this.session);

    const document = await query.exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async findAdminByUsername(username: string): Promise<User | null> {
    const document = await this.model.findOne({ username, role: "admin" }).select("+password").exec();
    return document ? UserMapper.toDomain(document) : null;
  }

  async findFiltered(filters: UserFilters): Promise<{ users: any[], total: number }> {
    const basePipeline: any[] = [
      { $match: { role: "user" } }
    ];

    // Filter by blocked status
    const blockedFilter = filters.includeBlocked();
    if (blockedFilter !== undefined) {
      basePipeline.push({ $match: { isBlocked: blockedFilter } });
    }

    // Search
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      basePipeline.push({
        $match: {
          $or: [
            { name: { $regex: filters.searchQuery, $options: "i" } },
            { username: { $regex: filters.searchQuery, $options: "i" } }
          ]
        }
      });
    }

    // Users pipeline
    const usersPipeline = [
      ...basePipeline,
      { $sort: filters.getSortOption() },
      { $skip: filters.getSkip() },
      { $limit: filters.limit }
    ];

    // Count pipeline
    const countPipeline = [...basePipeline, { $count: "count" }];

    const [users, totalResult] = await Promise.all([
      this.model.aggregate(usersPipeline),
      this.model.aggregate(countPipeline)
    ]);

    const total = totalResult.length > 0 ? totalResult[0].count : 0;

    return { users, total };
  }

  async save(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);

    if (user.id) {
      await this.model.findByIdAndUpdate(
        user.id,
        { $set: persistenceData },
        { new: true }
      );
      return user;
    } else {
      const newDoc = new this.model(persistenceData);
      await newDoc.save();

      return UserMapper.toDomain(newDoc);
    }
  }

  async addToWishlist(userId: string, bookId: string): Promise<void> {
    await this.model.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          favoriteBooks: new mongoose.Types.ObjectId(bookId)
        }
      },
      { new: true }
    );
  }

  async removeFromWishlist(userId: string, bookId: string): Promise<void> {
    await this.model.findByIdAndUpdate(
      userId,
      {
        $pull: {
          favoriteBooks: new mongoose.Types.ObjectId(bookId)
        }
      },
      { new: true }
    );
  }

  async getWishlist(userId: string): Promise<string[]> {
    const user = await this.model
      .findById(userId)
      .populate("favoriteBooks")
      .exec();

    if (!user) {
      return [];
    }

    return user.favoriteBooks.map((book: any) => book._id.toString());
  }

  async blockUser(uid: string): Promise<void> {
    await this.model.updateOne(
      { firebaseUid: uid },
      { $set: { isBlocked: true } }
    );
  }

  async unblockUser(uid: string): Promise<void> {
    await this.model.updateOne(
      { firebaseUid: uid },
      { $set: { isBlocked: false } }
    );
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}