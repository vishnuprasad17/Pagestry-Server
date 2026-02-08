import { CartItemResponseDto } from "../dto/CartResponseDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";
import { ICartRepository } from "../ports/ICartRepository.js";

export class GetCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async execute(userId: string): Promise<CartItemResponseDto[]> {
    const cart = await this.cartRepository.findByUserId(userId);
    
    if (!cart || cart.isEmpty()) {
      return [];
    }

    const bookIds = cart.getItems().map(item => item.bookId);
    const books = await this.bookRepository.findByIds(bookIds);
    
    const bookMap = new Map(books.map(book => [book.id, book]));

    return cart.getItems()
      .map(item => {
        const book = bookMap.get(item.bookId);
        if (!book) return null;

        return {
          id: book.id,
          title: book.title,
          sellingPrice: book.sellingPrice,
          stock: book.stock,
          coverImage: book.coverImage,
          quantity: item.quantity
        };
      })
      .filter((item): item is CartItemResponseDto => item !== null);
  }
}