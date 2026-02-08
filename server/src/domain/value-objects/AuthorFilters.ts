export class AuthorFilters {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 5,
    public readonly sortBy?: 'featured' | 'name-asc' | 'name-desc' | 'newest',
    public readonly searchQuery?: string
  ) {
    if (page < 1) throw new Error("Page must be at least 1");
    if (limit < 1) throw new Error("Limit must be at least 1");
  }

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }

  getSortOption(): any {
    switch (this.sortBy) {
      case 'featured':
        return { isFeatured: -1, createdAt: -1 };
      case 'name-asc':
        return { name: 1 };
      case 'name-desc':
        return { name: -1 };
      default:
        return { createdAt: -1 };
    }
  }
}