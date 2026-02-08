export class ReviewPagination {
  private static readonly REVIEWS_PER_PAGE = 7;

  constructor(
    public readonly page: number = 1
  ) {
    if (page < 1) throw new Error("Page must be at least 1");
  }

  getLimit(): number {
    return ReviewPagination.REVIEWS_PER_PAGE;
  }

  getSkip(): number {
    return (this.page - 1) * ReviewPagination.REVIEWS_PER_PAGE;
  }

  calculateTotalPages(totalReviews: number): number {
    return Math.ceil(totalReviews / ReviewPagination.REVIEWS_PER_PAGE);
  }
}