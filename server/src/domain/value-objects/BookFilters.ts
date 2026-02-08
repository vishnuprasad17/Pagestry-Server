export class BookFilters {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 12,
    public readonly categoryId?: string,
    public readonly sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest',
    public readonly searchQuery?: string
  ) {
    if (page < 1) throw new Error("Page must be at least 1");
    if (limit < 1) throw new Error("Limit must be at least 1");
  }

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }
}