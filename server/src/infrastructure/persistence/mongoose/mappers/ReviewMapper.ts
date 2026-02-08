import mongoose from "mongoose";
import { Review } from "../../../../domain/entities/Review.js";
import { UserMapper } from "./UserMapper.js";
import { User } from "../../../../domain/entities/User.js";

export class ReviewMapper {
  static toDomain(document: any): Review {
    const userId: string | User =
        document.userId && typeof document.userId === "object" && "_id" in document.userId
          ? UserMapper.toDomain(document.userId)
          : document.userId.toString();
    const likedBy = new Set<string>(
      (document.likedBy || []).map((id: any) => id.toString())
    );
    const dislikedBy = new Set<string>(
      (document.dislikedBy || []).map((id: any) => id.toString())
    );

    return Review.reconstitute({
      id: document._id.toString(),
      userId: userId,
      bookId: document.bookId.toString(),
      title: document.title,
      content: document.content,
      rating: document.rating,
      likedBy: likedBy,
      dislikedBy: dislikedBy,
      createdAt: document.createdAt
    });
  }

  static toPersistence(review: Review): any {
    const likedByIds = review.getLikedByUserIds().map(
      id => new mongoose.Types.ObjectId(id)
    );
    const dislikedByIds = review.getDislikedByUserIds().map(
      id => new mongoose.Types.ObjectId(id)
    );

    return {
      userId: new mongoose.Types.ObjectId(review.userId as string),
      bookId: new mongoose.Types.ObjectId(review.bookId),
      title: review.getTitle(),
      content: review.getContent(),
      rating: review.getRating(),
      likes: review.getLikesCount(),
      dislikes: review.getDislikesCount(),
      likedBy: likedByIds,
      dislikedBy: dislikedByIds
    };
  }
}