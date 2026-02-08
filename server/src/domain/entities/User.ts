import { AuthProvider } from "../value-objects/AuthProvider.js";
import { UserRole } from "../value-objects/UserRole.js";
import { 
  InvalidUserDataError, 
  AdminBlockAttemptError 
} from "../errors/UserErrors.js";

export class User {
  private constructor(
    public readonly id: string,
    private username: string,
    private name: string,
    private role: UserRole,
    private authProvider: AuthProvider,
    private isBlocked: boolean = false,
    private firebaseUid?: string,
    private profileImage?: string,
    private passwordHash?: string,
    private favoriteBooks: string[] = [],
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: {
    username: string;
    name: string;
    role: UserRole;
    authProvider: AuthProvider;
    isBlocked?: boolean;
    firebaseUid?: string;
    profileImage?: string;
    passwordHash?: string;
  }): User {
    // Validate on creation
    if (!data.username || data.username.trim().length === 0) {
      throw new InvalidUserDataError("Username is required");
    }
    if (!data.name || data.name.trim().length === 0) {
      throw new InvalidUserDataError("Name is required");
    }
    if (data.role === "admin" && !data.passwordHash) {
      throw new InvalidUserDataError("Admin users must have a password");
    }

    return new User(
      "",
      data.username,
      data.name,
      data.role,
      data.authProvider,
      data.isBlocked ?? false,
      data.firebaseUid,
      data.profileImage,
      data.passwordHash,
      [],
      new Date()
    );
  }

  static reconstitute(data: {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    authProvider: AuthProvider;
    isBlocked: boolean;
    firebaseUid?: string;
    profileImage?: string;
    passwordHash?: string;
    favoriteBooks: string[];
    createdAt: Date;
  }): User {
    return new User(
      data.id,
      data.username,
      data.name,
      data.role,
      data.authProvider,
      data.isBlocked,
      data.firebaseUid,
      data.profileImage,
      data.passwordHash,
      data.favoriteBooks,
      data.createdAt
    );
  }

  getUsername(): string {
    return this.username;
  }

  getName(): string {
    return this.name;
  }

  getRole(): UserRole {
    return this.role;
  }

  getAuthProvider(): AuthProvider {
    return this.authProvider;
  }

  getFirebaseUid(): string | undefined {
    return this.firebaseUid;
  }

  getProfileImage(): string | undefined {
    return this.profileImage;
  }

  getPasswordHash(): string | undefined {
    return this.passwordHash;
  }

  getFavoriteBooks(): readonly string[] {
    return [...this.favoriteBooks];
  }

  isUserBlocked(): boolean {
    return this.isBlocked;
  }

  isAdmin(): boolean {
    return this.role === "admin";
  }

  isRegularUser(): boolean {
    return this.role === "user";
  }

  blockUser(): void {
    if (this.role === "admin") {
      throw new AdminBlockAttemptError();
    }
    this.isBlocked = true;
  }

  unblockUser(): void {
    this.isBlocked = false;
  }

  addFavoriteBook(bookId: string): void {
    if (!bookId || bookId.trim().length === 0) {
      throw new InvalidUserDataError("Book ID is required");
    }
    if (!this.favoriteBooks.includes(bookId)) {
      this.favoriteBooks.push(bookId);
    }
  }

  removeFavoriteBook(bookId: string): void {
    this.favoriteBooks = this.favoriteBooks.filter(id => id !== bookId);
  }

  isFavoriteBook(bookId: string): boolean {
    return this.favoriteBooks.includes(bookId);
  }

  updateName(newName: string | undefined): void {
    if (this.isRegularUser() && this.getAuthProvider() !== "password") {
      return;
    }

    if (!newName || newName.trim().length === 0) {
      throw new InvalidUserDataError("Name cannot be empty");
    }
    this.name = newName;
  }

  updatePassword(newPasswordHash: string): void {
    if (this.role !== "admin") {
      throw new InvalidUserDataError("Only admin users can update password");
    }
    if (!newPasswordHash || newPasswordHash.trim().length === 0) {
      throw new InvalidUserDataError("Password hash is required");
    }
    this.passwordHash = newPasswordHash;
  }

  updateProfileImage(newProfileImage: string): void {
    if (!newProfileImage || newProfileImage.trim().length === 0) {
      throw new InvalidUserDataError("Profile image is required");
    }
    this.profileImage = newProfileImage;
  }
}