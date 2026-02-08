export class UserWishlist {
  constructor(
    public readonly userId: string,
    private favoriteBooks: Set<string> = new Set()
  ) {}

  getFavoriteBooks(): string[] {
    return Array.from(this.favoriteBooks);
  }

  addToFavorites(bookId: string): void {
    this.favoriteBooks.add(bookId);
  }

  removeFromFavorites(bookId: string): void {
    this.favoriteBooks.delete(bookId);
  }

  isFavorite(bookId: string): boolean {
    return this.favoriteBooks.has(bookId);
  }

  getFavoritesCount(): number {
    return this.favoriteBooks.size;
  }

  clearFavorites(): void {
    this.favoriteBooks.clear();
  }
}