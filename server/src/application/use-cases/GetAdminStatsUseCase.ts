import { AdminStatsDto } from "../dto/AdminDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetAdminStatsUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async execute(): Promise<AdminStatsDto> {
    const [orderStats, topCustomers, totalBooks] = await Promise.all([
      this.orderRepository.getOrderStats(),
      this.orderRepository.getTopCustomers(),
      this.bookRepository.getTotalBooks()
    ]);

    return {
      orderStats,
      topCustomers,
      totalBooks
    };
  }
}