import mongoose from "mongoose";
import { IReviewRepository } from "../../../../application/ports/IReviewRepository.js";
import { Review } from "../../../../domain/entities/Review.js";
import { ReviewMapper } from "../mappers/ReviewMapper.js";
import { ReviewModel } from "../models/ReviewModel.js";

export class MongoReviewRepository implements IReviewRepository {
  constructor(
    private readonly model: typeof ReviewModel,
    private readonly session?: mongoose.ClientSession
  ) {}

  async findById(reviewId: string): Promise<Review | null> {
    const query = this.model.findById(reviewId);
    if (this.session) query.session(this.session);

    const document = await query.exec();
    return document ? ReviewMapper.toDomain(document) : null;
  }

  async findByBookId(bookId: string, skip: number, limit: number): Promise<Review[]> {
    const documents = await this.model
      .find({ bookId: new mongoose.Types.ObjectId(bookId) })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return documents.map(doc => ReviewMapper.toDomain(doc));
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<Review | null> {
    const document = await this.model
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
        bookId: new mongoose.Types.ObjectId(bookId)
      })
      .exec();

    return document ? ReviewMapper.toDomain(document) : null;
  }

  async countByBookId(bookId: string): Promise<number> {
    return await this.model.countDocuments({
      bookId: new mongoose.Types.ObjectId(bookId)
    });
  }

  async save(review: Review): Promise<Review> {
    const persistenceData = ReviewMapper.toPersistence(review);
    const options = this.session ? { session: this.session } : {};

    if (review.id) {
      await this.model.findByIdAndUpdate(
        review.id,
        { $set: persistenceData },
        { new: true, ...options }
      );
      return review;
    } else {
      const [newDoc] = await this.model.create([persistenceData], options);

      return ReviewMapper.toDomain(newDoc);
    }
  }

  async delete(reviewId: string): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await this.model.findByIdAndDelete(reviewId, options);
  }
}