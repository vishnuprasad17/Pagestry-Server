import mongoose from "mongoose";
import { User } from "../../../../domain/entities/User.js";

export class UserMapper {
  static toDomain(document: any): User {
    return User.reconstitute({
      id: document._id.toString(),
      username: document.username,
      name: document.name,
      role: document.role,
      authProvider: document.authProvider,
      isBlocked: document.isBlocked,
      firebaseUid: document.firebaseUid,
      profileImage: document.profileImage,
      passwordHash: document.password,
      favoriteBooks: document.favoriteBooks?.map((id: any) => id.toString()) || [],
      createdAt: document.createdAt
    });
  }

  static toPersistence(user: User): any {
    const data: any = {
      username: user.getUsername(),
      name: user.getName(),
      role: user.getRole(),
      authProvider: user.getAuthProvider(),
      isBlocked: user.isUserBlocked(),
      favoriteBooks: user.getFavoriteBooks().map(id => new mongoose.Types.ObjectId(id))
    };

    if (user.getFirebaseUid()) {
      data.firebaseUid = user.getFirebaseUid();
    }

    if (user.getProfileImage()) {
      data.profileImage = user.getProfileImage();
    }

    if (user.getPasswordHash()) {
      data.password = user.getPasswordHash();
    }

    return data;
  }
}