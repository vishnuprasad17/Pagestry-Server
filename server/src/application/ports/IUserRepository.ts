import { User } from "../../domain/entities/User.js";
import { UserFilters } from "../../domain/value-objects/UserFilters.js";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  findFiltered(filters: UserFilters): Promise<{ users: any[], total: number }>;
  addToWishlist(userId: string, bookId: string): Promise<void>;
  removeFromWishlist(userId: string, bookId: string): Promise<void>;
  getWishlist(userId: string): Promise<string[]>;
  findAdminByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  blockUser(uid: string): Promise<void>;
  unblockUser(uid: string): Promise<void>;
}