import { RevenueFilters } from "../../domain/value-objects/RevenueFilters.js";
import { RevenueAnalyticsDto } from "../dto/AdminDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetRevenueAnalyticsUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(filters: RevenueFilters): Promise<RevenueAnalyticsDto> {
    const basePipeline: any[] = [
      { $match: { "paymentDetails.status": "SUCCESS" } }
    ];

    if (filters.startDate) {
      basePipeline.push({ $match: { createdAt: { $gte: filters.startDate } } });
    }
    if (filters.endDate) {
      basePipeline.push({ $match: { createdAt: { $lte: filters.endDate } } });
    }

    const [analyticsResult, dailyBreakdown] = await Promise.all([
      this.orderRepository.getRevenueAnalytics(basePipeline),
      this.orderRepository.getDailyBreakdown(basePipeline)
    ]);

    const analytics = analyticsResult[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      razorpayRevenue: 0,
      codRevenue: 0
    };

    return {
      summary: analytics,
      dailyBreakdown
    };
  }
}