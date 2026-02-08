import { Author } from "./Author.js";
import { Category } from "./Category.js";
import { 
  InvalidBookDataError, 
  InsufficientStockError, 
  InvalidRatingError 
} from "../errors/BookErrors.js";

export class Book {
  private constructor(
    public readonly id: string,
    public title: string,
    public readonly authorId: string | Author,
    public description: string,
    public categoryId: string | Category,
    public readonly ISBN: string,
    public coverImage: string,
    public mrp: number,
    public sellingPrice: number,
    public stock: number,
    public featured: boolean = false,
    private totalRating: number = 0,
    private ratingCount: number = 0,
    private averageRating: number = 0,
    private ratingBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: {
    title: string;
    authorId: string | Author;
    description: string;
    categoryId: string | Category;
    ISBN: string;
    coverImage: string;
    mrp: number;
    sellingPrice: number;
    stock: number;
    featured?: boolean;
  }): Book {
    // Validate on creation
    if (!data.title || data.title.trim().length === 0) {
      throw new InvalidBookDataError("Book title is required");
    }
    if (!data.description || data.description.trim().length === 0) {
      throw new InvalidBookDataError("Book description is required");
    }
    if (!data.ISBN || data.ISBN.trim().length === 0) {
      throw new InvalidBookDataError("ISBN is required");
    }
    if (!data.coverImage || data.coverImage.trim().length === 0) {
      throw new InvalidBookDataError("Cover image is required");
    }
    if (data.mrp < 0 || data.sellingPrice < 0) {
      throw new InvalidBookDataError("Prices must be positive");
    }
    if (data.sellingPrice > data.mrp) {
      throw new InvalidBookDataError("Selling price cannot exceed MRP");
    }
    if (data.stock < 0) {
      throw new InvalidBookDataError("Stock cannot be negative");
    }

    return new Book(
      "",
      data.title,
      data.authorId,
      data.description,
      data.categoryId,
      data.ISBN,
      data.coverImage,
      data.mrp,
      data.sellingPrice,
      data.stock,
      data.featured ?? false,
      0,
      0,
      0,
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      new Date()
    );
  }

  static reconstitute(data: {
    id: string;
    title: string;
    authorId: string | Author;
    description: string;
    categoryId: string | Category;
    ISBN: string;
    coverImage: string;
    mrp: number;
    sellingPrice: number;
    stock: number;
    featured: boolean;
    totalRating: number;
    ratingCount: number;
    averageRating: number;
    ratingBreakdown: Record<number, number>;
    createdAt: Date;
  }): Book {
    return new Book(
      data.id,
      data.title,
      data.authorId,
      data.description,
      data.categoryId,
      data.ISBN,
      data.coverImage,
      data.mrp,
      data.sellingPrice,
      data.stock,
      data.featured,
      data.totalRating,
      data.ratingCount,
      data.averageRating,
      data.ratingBreakdown,
      data.createdAt
    );
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  hasEnoughStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  reduceStock(quantity: number): void {
    if (!this.hasEnoughStock(quantity)) {
      throw new InsufficientStockError(this.id, this.stock, quantity);
    }
    this.stock -= quantity;
  }

  increaseStock(quantity: number): void {
    if (quantity < 0) {
      throw new InvalidBookDataError("Cannot increase stock by negative amount");
    }
    this.stock += quantity;
  }

  addRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new InvalidRatingError(rating);
    }
    this.totalRating += rating;
    this.ratingCount += 1;
    this.ratingBreakdown[rating] = (this.ratingBreakdown[rating] || 0) + 1;
    this.recalculateAverageRating();
  }

  updateRating(oldRating: number, newRating: number): void {
    if (oldRating < 1 || oldRating > 5 || newRating < 1 || newRating > 5) {
      throw new InvalidRatingError(newRating);
    }
    this.totalRating = this.totalRating - oldRating + newRating;
    this.ratingBreakdown[oldRating] = Math.max(0, this.ratingBreakdown[oldRating] - 1);
    this.ratingBreakdown[newRating] = (this.ratingBreakdown[newRating] || 0) + 1;
    this.recalculateAverageRating();
  }


  removeRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new InvalidRatingError(rating);
    }
    this.totalRating -= rating;
    this.ratingCount = Math.max(0, this.ratingCount - 1);
    this.ratingBreakdown[rating] = Math.max(0, this.ratingBreakdown[rating] - 1);
    this.recalculateAverageRating();
  }

  private recalculateAverageRating(): void {
    if (this.ratingCount === 0) {
      this.averageRating = 0;
    } else {
      this.averageRating = Number((this.totalRating / this.ratingCount).toFixed(1));
    }
  }

  getAverageRating(): number {
    return this.averageRating;
  }

  getRatingCount(): number {
    return this.ratingCount;
  }

  getRatingBreakdown(): Record<number, number> {
    return this.ratingBreakdown;
  }

  getDiscountPercentage(): number {
    if (this.mrp === 0) return 0;
    return Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
  }

  toggleFeatured(): void {
    this.featured = !this.featured;
  }

  updateDetails(updates: {
    title?: string;
    description?: string;
    categoryId?: string | Category;
    coverImage?: string;
    mrp?: number;
    sellingPrice?: number;
    stock?: number;
    featured?: boolean;
  }): void {
    // Validate each field before updating
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        throw new InvalidBookDataError("Book title is required");
      }
      this.title = updates.title;
    }

    if (updates.description !== undefined) {
      if (!updates.description || updates.description.trim().length === 0) {
        throw new InvalidBookDataError("Book description is required");
      }
      this.description = updates.description;
    }

    if (updates.coverImage !== undefined) {
      if (!updates.coverImage || updates.coverImage.trim().length === 0) {
        throw new InvalidBookDataError("Cover image is required");
      }
      this.coverImage = updates.coverImage;
    }

    // Handle price updates - need to validate together
    const newMrp = updates.mrp !== undefined ? updates.mrp : this.mrp;
    const newSellingPrice = updates.sellingPrice !== undefined ? updates.sellingPrice : this.sellingPrice;

    if (newMrp < 0 || newSellingPrice < 0) {
      throw new InvalidBookDataError("Prices must be positive");
    }
    if (newSellingPrice > newMrp) {
      throw new InvalidBookDataError("Selling price cannot exceed MRP");
    }

    if (updates.mrp !== undefined) this.mrp = updates.mrp;
    if (updates.sellingPrice !== undefined) this.sellingPrice = updates.sellingPrice;

    if (updates.stock !== undefined) {
      if (updates.stock < 0) {
        throw new InvalidBookDataError("Stock cannot be negative");
      }
      this.stock = updates.stock;
    }

    if (updates.categoryId !== undefined) {
      this.categoryId = updates.categoryId;
    }

    if (updates.featured !== undefined) {
      this.featured = updates.featured;
    }
  }
}