import mongoose from "mongoose";
import { IBookRepository } from "../../../../application/ports/IBookRepository.js";
import { BookModel } from "../models/BookModel.js";
import { Book } from "../../../../domain/entities/Book.js";
import { BookMapper } from "../mappers/BookMapper.js";
import { BookFilters } from "../../../../domain/value-objects/BookFilters.js";

export class MongoBookRepository implements IBookRepository {
  constructor(
    private readonly model: typeof BookModel,
    private readonly session?: mongoose.ClientSession,
  ) {}

  async findById(id: string): Promise<Book | null> {
    const query = this.model
      .findById(id)
      .populate("category", "name")
      .populate("authorId", "name");

    if (this.session) {
      query.session(this.session);
    }

    const document = await query.exec();
    return document ? BookMapper.toDomain(document) : null;
  }

  async findByIds(ids: string[]): Promise<Book[]> {
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const query = this.model.find({ _id: { $in: objectIds } });

    if (this.session) {
      query.session(this.session);
    }

    const documents = await query.exec();
    return documents.map((doc) => BookMapper.toDomain(doc));
  }

  async findByISBN(isbn: string): Promise<Book | null> {
    const document = await this.model.findOne({ ISBN: isbn }).exec();
    return document ? BookMapper.toDomain(document) : null;
  }

  async findByAuthorId(authorId: string): Promise<Book[]> {
    const documents = await this.model
      .find({ authorId: new mongoose.Types.ObjectId(authorId) })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((doc) => BookMapper.toDomain(doc));
  }

  async findAll(): Promise<Book[]> {
    const documents = await this.model
      .find()
      .populate("category")
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((doc) => BookMapper.toDomain(doc));
  }

  async findFiltered(
    filters: BookFilters,
  ): Promise<{ books: Book[]; total: number }> {
    let sortOption: any = { createdAt: -1 };

    if (filters.sortBy === "price_asc") sortOption = { sellingPrice: 1 };
    if (filters.sortBy === "price_desc") sortOption = { sellingPrice: -1 };
    if (filters.sortBy === "rating") sortOption = { averageRating: -1 };

    const basePipeline: any[] = [
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ];

    if (filters.categoryId && filters.categoryId !== "all") {
      basePipeline.push({
        $match: {
          "category._id": new mongoose.Types.ObjectId(filters.categoryId),
        },
      });
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      basePipeline.push({
        $match: {
          $or: [
            { title: { $regex: filters.searchQuery, $options: "i" } },
            { ISBN: { $regex: filters.searchQuery, $options: "i" } },
            { "author.name": { $regex: filters.searchQuery, $options: "i" } },
          ],
        },
      });
    }

    const booksPipeline = [
      ...basePipeline,
      { $sort: sortOption },
      { $skip: filters.getSkip() },
      { $limit: filters.limit },
      {
        $project: {
          _id: 1,
          title: 1,
          authorId: "$author",
          description: 1,
          category: 1,
          ISBN: 1,
          coverImage: 1,
          mrp: 1,
          sellingPrice: 1,
          stock: 1,
          featured: 1,
          totalRating: 1,
          ratingCount: 1,
          averageRating: 1,
          ratingBreakdown: 1,
          createdAt: 1,
        },
      },
    ];

    const countPipeline = [...basePipeline, { $count: "total" }];

    const [books, totalResult] = await Promise.all([
      this.model.aggregate(booksPipeline),
      this.model.aggregate(countPipeline),
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      books: books.map((doc) => BookMapper.toDomain(doc)),
      total,
    };
  }

  async findFeatured(): Promise<Book[]> {
    const documents = await this.model
      .find({ featured: true })
      .populate("authorId")
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((doc) => BookMapper.toDomain(doc));
  }

  async findByAuthor(authorId: string): Promise<Book[]> {
    const documents = await this.model
      .find({ authorId: new mongoose.Types.ObjectId(authorId) })
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((doc) => BookMapper.toDomain(doc));
  }

  async search(query: string, limit: number = 7): Promise<Book[]> {
    if (!query || query.trim() === "") return [];

    const documents = await this.model
      .find({ title: { $regex: query, $options: "i" } })
      .populate("category", "name")
      .select("_id authorId title coverImage category")
      .limit(limit)
      .exec();

    return documents.map((doc) => BookMapper.toDomain(doc));
  }

  async save(book: Book): Promise<Book> {
    const persistenceData = BookMapper.toPersistence(book);
    const options = this.session ? { session: this.session } : {};

    if (book.id) {
      await this.model.findByIdAndUpdate(
        book.id,
        { $set: persistenceData },
        { new: true, runValidators: true, ...options },
      );
      return book;
    } else {
      const [newDoc] = await this.model.create([persistenceData], options);
      
      return BookMapper.toDomain(newDoc);
    }
  }

  async delete(id: string): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await this.model.findByIdAndDelete(id, options);
  }

  async count(): Promise<number> {
    return await this.model.countDocuments();
  }

  async countFeatured(): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { featured: true } },
      { $count: "count" },
    ]);
    return result[0]?.count || 0;
  }

  async checkStock(bookId: string, quantity: number): Promise<boolean> {
    const book = await this.model
      .findById(bookId)
      .select("stock")
      .session(this.session || null)
      .exec();

    return book ? book.stock >= quantity : false;
  }

  async reduceStock(bookId: string, quantity: number): Promise<void> {
    const result = await this.model.updateOne(
      { _id: bookId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { session: this.session || undefined },
    );

    if (result.modifiedCount === 0) {
      throw new Error(`Failed to reduce stock for book ${bookId}`);
    }
  }

  async increaseStock(bookId: string, quantity: number): Promise<void> {
    await this.model.updateOne(
      { _id: bookId },
      { $inc: { stock: quantity } },
      { session: this.session || undefined },
    );
  }

  async getBookDetails(
    bookId: string,
  ): Promise<{
    id: string;
    title: string;
    stock: number;
    category: string;
    coverImage: string;
  } | null> {
    const book = await this.model
      .findById(bookId)
      .select("title stock category coverImage")
      .populate("category", "name")
      .session(this.session || null)
      .exec();

    if (!book) return null;

    return {
      id: book._id.toString(),
      title: book.title,
      stock: book.stock,
      category: (book.category as any)?.name,
      coverImage: book.coverImage,
    };
  }

  async addRating(bookId: string, rating: number): Promise<void> {
    const book = await this.model
      .findById(bookId)
      .session(this.session || null)
      .exec();

    if (!book) {
      throw new Error("Book not found");
    }

    const newTotal = book.totalRating + rating;
    const newCount = book.ratingCount + 1;

    await this.model.updateOne(
      { _id: bookId },
      {
        $inc: {
          totalRating: rating,
          ratingCount: 1,
          [`ratingBreakdown.${rating}`]: 1,
        },
        $set: {
          averageRating: Number((newTotal / newCount).toFixed(1)),
        },
      },
      { session: this.session || undefined },
    );
  }

  async updateRating(
    bookId: string,
    oldRating: number,
    newRating: number,
  ): Promise<void> {
    const book = await this.model
      .findById(bookId)
      .session(this.session || null)
      .exec();

    if (!book) {
      throw new Error("Book not found");
    }

    const newTotal = book.totalRating - oldRating + newRating;
    const newCount = book.ratingCount; // Unchanged

    await this.model.updateOne(
      { _id: bookId },
      {
        $inc: {
          totalRating: newRating - oldRating,
          [`ratingBreakdown.${oldRating}`]: -1,
          [`ratingBreakdown.${newRating}`]: 1,
        },
        $set: {
          averageRating:
            newCount === 0 ? 0 : Number((newTotal / newCount).toFixed(1)),
        },
      },
      { session: this.session || undefined },
    );
  }

  async removeRating(bookId: string, rating: number): Promise<void> {
    const book = await this.model
      .findById(bookId)
      .session(this.session || null)
      .exec();

    if (!book) {
      throw new Error("Book not found");
    }

    const newTotal = book.totalRating - rating;
    const newCount = book.ratingCount - 1;

    await this.model.updateOne(
      { _id: bookId },
      {
        $inc: {
          totalRating: -rating,
          ratingCount: -1,
          [`ratingBreakdown.${rating}`]: -1,
        },
        $set: {
          averageRating:
            newCount <= 0 ? 0 : Number((newTotal / newCount).toFixed(1)),
        },
      },
      { session: this.session || undefined },
    );
  }

  async getTotalBooks(): Promise<number> {
    return await this.model.countDocuments();
  }
}
