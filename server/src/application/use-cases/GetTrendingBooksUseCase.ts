import { TrendingBookDto } from "../dto/BookDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetTrendingBooksUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(daysBack: number = 30): Promise<TrendingBookDto[]> {
    const trendingBooks = await this.orderRepository.getTrendingBooks(daysBack, 10);
    
    return trendingBooks.map((book, index) => ({
      id: book.id,
      title: book.title,
      cover: book.coverImage,
      trend: index + 1
    }));
  }
}