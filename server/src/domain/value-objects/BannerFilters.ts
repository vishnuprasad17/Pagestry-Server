export class BannerFilters {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 12,
    public readonly sortBy?: 'active' | 'inactive' | 'newest'
  ) {
    if (page < 1) throw new Error("Page must be at least 1");
    if (limit < 1) throw new Error("Limit must be at least 1");
  }

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }

  getActiveFilter(): boolean | undefined {
    if (this.sortBy === 'active') return true;
    if (this.sortBy === 'inactive') return false;
    return undefined;
  }
}