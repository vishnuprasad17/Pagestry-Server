export class TrendingBook {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly coverImage: string,
    public readonly rank: number,
    public readonly totalQuantity: number,
    public readonly totalOrders: number,
    public readonly recentOrders: number,
    public readonly trendingScore: number
  ) {}
}