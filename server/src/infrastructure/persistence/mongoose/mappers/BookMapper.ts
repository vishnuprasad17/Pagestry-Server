import mongoose from "mongoose";
import { Book } from "../../../../domain/entities/Book.js";
import { AuthorMapper } from "./AuthorMapper.js";
import { CategoryMapper } from "./CategoryMapper.js";
import { Author } from "../../../../domain/entities/Author.js";

export class BookMapper {
  static toDomain(document: any): Book {
    const authorId: string | Author =
    document.authorId && typeof document.authorId === "object" && "_id" in document.authorId
      ? AuthorMapper.toDomain(document.authorId)
      : document.authorId.toString();

  const category =
    document.category && typeof document.category === "object" && "_id" in document.category
      ? CategoryMapper.toDomain(document.category)
      : document.category.toString();

    return Book.reconstitute({
      id: document._id.toString(),
      title: document.title,
      authorId: authorId,
      description: document.description,
      categoryId: category,
      ISBN: document.ISBN,
      coverImage: document.coverImage,
      mrp: document.mrp,
      sellingPrice: document.sellingPrice,
      stock: document.stock,
      featured: document.featured,
      totalRating: document.totalRating,
      ratingCount: document.ratingCount,
      averageRating: document.averageRating,
      ratingBreakdown: document.ratingBreakdown,
      createdAt: document.createdAt
    });
  }

  static toPersistence(book: Book): any {
    return {
      title: book.title,
      authorId: new mongoose.Types.ObjectId(book.authorId as string),
      description: book.description,
      category: new mongoose.Types.ObjectId(book.categoryId as string),
      ISBN: book.ISBN,
      coverImage: book.coverImage,
      mrp: book.mrp,
      sellingPrice: book.sellingPrice,
      stock: book.stock,
      featured: book.featured,
      totalRating: book['totalRating'],
      ratingCount: book.getRatingCount(),
      averageRating: book.getAverageRating(),
      ratingBreakdown: book.getRatingBreakdown()
    };
  }
}