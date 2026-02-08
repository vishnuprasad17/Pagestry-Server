import { MonthlyRevenueDto } from "../dto/AdminDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetMonthlyRevenueUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(targetYear: number): Promise<MonthlyRevenueDto> {
    const startDate = new Date(Date.UTC(targetYear, 0, 1));
    const endDate = new Date(Date.UTC(targetYear + 1, 0, 1));

    const monthlyRevenue = await this.orderRepository.getMonthlySales(startDate, endDate);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const revenueByMonth = monthNames.map((month, index) => {
      const monthNumber = index + 1;
      const monthData = monthlyRevenue.find(item => item.month === monthNumber);
      
      return {
        month,
        revenue: monthData ? Math.round(monthData.totalRevenue) : 0,
        orderCount: monthData ? monthData.orderCount : 0
      };
    });

    const totalRevenue = revenueByMonth.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = revenueByMonth.reduce((sum, item) => sum + item.orderCount, 0);

    return {
      success: true,
      year: targetYear,
      data: revenueByMonth,
      summary: {
        totalRevenue,
        totalOrders,
        averageMonthlyRevenue: Math.round(totalRevenue / 12)
      }
    };
  }
}