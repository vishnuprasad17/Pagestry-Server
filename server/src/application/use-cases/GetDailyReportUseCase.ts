import { DailyReportDto } from "../dto/AdminDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetDailyReportUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(date: Date): Promise<DailyReportDto> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const report = await this.orderRepository.getDailyReport(startOfDay, endOfDay);

    return {
      date: date.toISOString().split("T")[0],
      ...report[0]
    };
  }
}