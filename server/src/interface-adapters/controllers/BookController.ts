import { Request, Response } from "express";
import { CreateBookUseCase } from "../../application/use-cases/CreateBookUseCase.js";
import { GetAllBooksUseCase } from "../../application/use-cases/GetAllBooksUseCase.js";
import { GetFilteredBooksUseCase } from "../../application/use-cases/GetFilteredBooksUseCase.js";
import { SearchBooksUseCase } from "../../application/use-cases/SearchBooksUseCase.js";
import { GetBookByIdUseCase } from "../../application/use-cases/GetBookByIdUseCase.js";
import { GetFeaturedBooksUseCase } from "../../application/use-cases/GetFeaturedBooksUseCase.js";
import { GetTrendingBooksUseCase } from "../../application/use-cases/GetTrendingBooksUseCase.js";
import { UpdateBookUseCase } from "../../application/use-cases/UpdateBookUseCase.js";
import { DeleteBookUseCase } from "../../application/use-cases/DeleteBookUseCase.js";
import { CreateBookDto, UpdateBookDto } from "../../application/dto/BookDto.js";

export class BookController {
  constructor(
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly getAllBooksUseCase: GetAllBooksUseCase,
    private readonly getFilteredBooksUseCase: GetFilteredBooksUseCase,
    private readonly searchBooksUseCase: SearchBooksUseCase,
    private readonly getBookByIdUseCase: GetBookByIdUseCase,
    private readonly getFeaturedBooksUseCase: GetFeaturedBooksUseCase,
    private readonly getTrendingBooksUseCase: GetTrendingBooksUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase
  ) {}

  async addBook(req: Request, res: Response): Promise<void> {
    const {
      title,
      authorId,
      description,
      categoryId,
      ISBN,
      featured,
      coverImage,
      mrp,
      sellingPrice,
      stock
    } = req.body;

    // Validation
    if (!title || !authorId || !description || !categoryId || !ISBN || !coverImage || !mrp || !sellingPrice) {
      res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
      return;
    }

    if (parseFloat(mrp) < 0 || parseFloat(sellingPrice) < 0) {
      res.status(400).json({
        success: false,
        message: 'Prices must be positive numbers'
      });
      return;
    }

    if (parseFloat(sellingPrice) > parseFloat(mrp)) {
      res.status(400).json({
        success: false,
        message: 'Selling price cannot be greater than MRP'
      });
      return;
    }

    const dto: CreateBookDto = {
      title,
      authorId,
      description,
      categoryId,
      ISBN,
      featured,
      coverImage,
      mrp: parseFloat(mrp),
      sellingPrice: parseFloat(sellingPrice),
      stock: stock ? parseFloat(stock) : 0
    };

    const book = await this.createBookUseCase.execute(dto);
      
    res.status(201).json({
      success: true,
      data: book,
      message: "Book added successfully"
    });
  }

  async getAllBooks(req: Request, res: Response): Promise<void> {
    const books = await this.getAllBooksUseCase.execute();
    res.status(200).json({
      success: true,
      data: books,
      message: "Books fetched successfully"
    });
  }

  async getFilteredBooks(req: Request, res: Response): Promise<void> {
    const {
      page = 1,
      limit = 12,
      category,
      sort,
      search
    } = req.query;

    const result = await this.getFilteredBooksUseCase.execute(
      Number(page),
      Number(limit),
      category as string,
      sort as string,
      search as string
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Books fetched successfully"
    });
  }

  async getSuggestions(req: Request, res: Response): Promise<void> {
    const search = req.query.search as string || "";
    const suggestions = await this.searchBooksUseCase.execute(search);
    
    res.status(200).json({
      success: true,
      data: suggestions,
      message: "Suggestions fetched successfully"
    });
  }

  async getFeaturedBooks(req: Request, res: Response): Promise<void> {
    const books = await this.getFeaturedBooksUseCase.execute();
    res.status(200).json({
      success: true,
      data: books,
      message: "Featured books fetched successfully"
    });
  }

  async getTrendingBooks(req: Request, res: Response): Promise<void> {
    const daysBack = req.query.daysBack as string || "30";
    const trendingBooks = await this.getTrendingBooksUseCase.execute(Number(daysBack));
    
    res.status(200).json({
      success: true,
      data: trendingBooks,
      message: "Trending books fetched successfully"
    });
  }

  async getSingleBook(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const book = await this.getBookByIdUseCase.execute(id);
      res.status(200).json({
        success: true,
        data: book,
        message: "Book fetched successfully"
      });
  }

  async updateBook(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto: UpdateBookDto = req.body;

    const book = await this.updateBookUseCase.execute(id, dto);
    res.status(200).json({
      success: true,
      data: book,
      message: "Book updated successfully"
    });
  }

  async deleteBook(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this.deleteBookUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Book deleted successfully"
    });
  }
}