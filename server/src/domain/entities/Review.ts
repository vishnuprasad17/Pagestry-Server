import { User } from "./User.js";
import { InvalidReviewDataError, InvalidRatingError } from "../errors/ReviewErrors.js";

export class Review {
  private constructor(
    public readonly id: string,
    public readonly userId: string | User,
    public readonly bookId: string,
    private title: string,
    private content: string,
    private rating: number,
    private likedBy: Set<string> = new Set(),
    private dislikedBy: Set<string> = new Set(),
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: {
    userId: string | User;
    bookId: string;
    title: string;
    content: string;
    rating: number;
  }): Review {
    // Validate on creation
    if (!data.title || data.title.trim().length === 0) {
      throw new InvalidReviewDataError("Review title is required");
    }
    if (!data.content || data.content.trim().length === 0) {
      throw new InvalidReviewDataError("Review content is required");
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new InvalidRatingError(data.rating);
    }
    if (!data.bookId || data.bookId.trim().length === 0) {
      throw new InvalidReviewDataError("Book ID is required");
    }

    return new Review(
      "",
      data.userId,
      data.bookId,
      data.title,
      data.content,
      data.rating,
      new Set(),
      new Set(),
      new Date()
    );
  }

  static reconstitute(data: {
    id: string;
    userId: string | User;
    bookId: string;
    title: string;
    content: string;
    rating: number;
    likedBy: Set<string> | string[];
    dislikedBy: Set<string> | string[];
    createdAt: Date;
  }): Review {
    // Convert arrays to Sets if needed (for database mapping)
    const likedBySet = data.likedBy instanceof Set 
      ? data.likedBy 
      : new Set(data.likedBy);
    const dislikedBySet = data.dislikedBy instanceof Set 
      ? data.dislikedBy 
      : new Set(data.dislikedBy);

    return new Review(
      data.id,
      data.userId,
      data.bookId,
      data.title,
      data.content,
      data.rating,
      likedBySet,
      dislikedBySet,
      data.createdAt
    );
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getRating(): number {
    return this.rating;
  }

  getLikesCount(): number {
    return this.likedBy.size;
  }

  getDislikesCount(): number {
    return this.dislikedBy.size;
  }

  getLikedByUserIds(): string[] {
    return Array.from(this.likedBy);
  }

  getDislikedByUserIds(): string[] {
    return Array.from(this.dislikedBy);
  }

  hasUserLiked(userId: string): boolean {
    return this.likedBy.has(userId);
  }

  hasUserDisliked(userId: string): boolean {
    return this.dislikedBy.has(userId);
  }

  like(userId: string): void {
    // If already liked, do nothing
    if (this.likedBy.has(userId)) {
      return;
    }

    // If user had disliked, remove the dislike
    if (this.dislikedBy.has(userId)) {
      this.dislikedBy.delete(userId);
    }

    // Add like
    this.likedBy.add(userId);
  }

  dislike(userId: string): void {
    // If already disliked, do nothing
    if (this.dislikedBy.has(userId)) {
      return;
    }

    // If user had liked, remove the like
    if (this.likedBy.has(userId)) {
      this.likedBy.delete(userId);
    }

    // Add dislike
    this.dislikedBy.add(userId);
  }

  removeLike(userId: string): void {
    this.likedBy.delete(userId);
  }

  removeDislike(userId: string): void {
    this.dislikedBy.delete(userId);
  }

  updateDetails(updates: {
    title?: string;
    content?: string;
    rating?: number;
  }): { oldRating: number; newRating: number } {
    const oldRating = this.rating;

    // Validate each field before updating
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        throw new InvalidReviewDataError("Review title is required");
      }
      this.title = updates.title;
    }

    if (updates.content !== undefined) {
      if (!updates.content || updates.content.trim().length === 0) {
        throw new InvalidReviewDataError("Review content is required");
      }
      this.content = updates.content;
    }

    if (updates.rating !== undefined) {
      if (updates.rating < 1 || updates.rating > 5) {
        throw new InvalidRatingError(updates.rating);
      }
      this.rating = updates.rating;
    }

    return { oldRating, newRating: this.rating };
  }

  isOwnedBy(userId: string): boolean {
    return (this.userId instanceof User ? this.userId.id : this.userId) === userId;
  }
}