import { Request, Response } from "express";
import { CreateAuthorUseCase } from "../../application/use-cases/CreateAuthorUseCase.js";
import { GetAllAuthorsUseCase } from "../../application/use-cases/GetAllAuthorsUseCase.js";
import { GetFilteredAuthorsUseCase } from "../../application/use-cases/GetFilteredAuthorsUseCase.js";
import { GetFeaturedAuthorsUseCase } from "../../application/use-cases/GetFeaturedAuthorsUseCase.js";
import { GetAuthorByIdUseCase } from "../../application/use-cases/GetAuthorByIdUseCase.js";
import { GetAuthorDetailsUseCase } from "../../application/use-cases/GetAuthorDetailsUseCase.js";
import { UpdateAuthorUseCase } from "../../application/use-cases/UpdateAuthorUseCase.js";
import { DeleteAuthorUseCase } from "../../application/use-cases/DeleteAuthorUseCase.js";
import { CreateAuthorDto, UpdateAuthorDto } from "../../application/dto/AuthorDto.js";

export class AuthorController {
  constructor(
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly getAllAuthorsUseCase: GetAllAuthorsUseCase,
    private readonly getFilteredAuthorsUseCase: GetFilteredAuthorsUseCase,
    private readonly getFeaturedAuthorsUseCase: GetFeaturedAuthorsUseCase,
    private readonly getAuthorByIdUseCase: GetAuthorByIdUseCase,
    private readonly getAuthorDetailsUseCase: GetAuthorDetailsUseCase,
    private readonly updateAuthorUseCase: UpdateAuthorUseCase,
    private readonly deleteAuthorUseCase: DeleteAuthorUseCase
  ) {}

  async getAllAuthors(req: Request, res: Response): Promise<void> {
    const authors = await this.getAllAuthorsUseCase.execute();
    res.status(200).json({
      success: true,
      data: authors,
      message: "Authors fetched successfully"
    });
  }

  async getFilteredAuthors(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 5, sort, search } = req.query;

    const result = await this.getFilteredAuthorsUseCase.execute(
      Number(page),
      Number(limit),
      sort as string,
      search as string
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Authors fetched successfully"
    });
  }

  async getFeaturedAuthors(req: Request, res: Response): Promise<void> {
    const authors = await this.getFeaturedAuthorsUseCase.execute();
    res.status(200).json({
      success: true,
      data: authors,
      message: "Featured authors fetched successfully"
    });
  }

  async getSingleAuthor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const author = await this.getAuthorByIdUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: author,
      message: "Author fetched successfully"
    });
  }

  async getAuthorDetails(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const details = await this.getAuthorDetailsUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: details,
      message: "Author details fetched successfully"
    });
  }

  async createAuthor(req: Request, res: Response): Promise<void> {
    const dto: CreateAuthorDto = req.body;

    const author = await this.createAuthorUseCase.execute(dto);
    res.status(201).json({
      success: true,
      data: author,
      message: "Author created successfully"
    });
  }

  async updateAuthor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto: UpdateAuthorDto = req.body;

    const author = await this.updateAuthorUseCase.execute(id, dto);
    res.status(200).json({
      success: true,
      data: author,
      message: "Author updated successfully"
    });
  }

  async deleteAuthor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this.deleteAuthorUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Author deleted successfully"
    });
  }
}