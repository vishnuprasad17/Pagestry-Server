import { YearlyRevenueDto } from "../dto/AdminDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetYearlyRevenueUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(): Promise<YearlyRevenueDto> {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];

    const yearlyData = await Promise.all(
      years.map(async (year) => {
        const startDate = new Date(Date.UTC(year, 0, 1));
        const endDate = new Date(Date.UTC(year + 1, 0, 1));

        const result = await this.orderRepository.getYearlySales(startDate, endDate);

        return {
          year,
          revenue: Math.round(result.totalRevenue),
          orders: result.orderCount
        };
      })
    );

    return {
      success: true,
      data: yearlyData
    };
  }
}