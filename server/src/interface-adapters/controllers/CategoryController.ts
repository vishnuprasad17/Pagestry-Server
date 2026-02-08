import { Request, Response } from "express";
import { CreateCategoryUseCase } from "../../application/use-cases/CreateCategoryUseCase.js";
import { GetAllCategoriesUseCase } from "../../application/use-cases/GetAllCategoriesUseCase.js";
import { UpdateCategoryUseCase } from "../../application/use-cases/UpdateCategoryUseCase.js";
import { DeleteCategoryUseCase } from "../../application/use-cases/DeleteCategoryUseCase.js";

export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getAllCategoryUseCase: GetAllCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    const dto = req.body;
    const data = await this.createCategoryUseCase.execute(dto);
    res.status(201).json({
      success: true,
      data,
      message: "Category created successfully",
    });
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const data = await this.getAllCategoryUseCase.execute();

    res.status(200).json({
      success: true,
      data,
      message: "Categories fetched successfully",
    });
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = req.body;
    const data = await this.updateCategoryUseCase.execute(id, dto);
    res.status(200).json({
      success: true,
      data,
      message: "Category updated successfully",
    });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deleteCategoryUseCase.execute(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
}