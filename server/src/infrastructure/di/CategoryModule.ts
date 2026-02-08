import { UpdateCategoryDto } from "../../application/dto/CategoryDto.js";
import { ICategoryRepository } from "../../application/ports/ICategoryRepository.js";
import { CreateCategoryUseCase } from "../../application/use-cases/CreateCategoryUseCase.js";
import { DeleteCategoryUseCase } from "../../application/use-cases/DeleteCategoryUseCase.js";
import { GetAllCategoriesUseCase } from "../../application/use-cases/GetAllCategoriesUseCase.js";
import { UpdateCategoryUseCase } from "../../application/use-cases/UpdateCategoryUseCase.js";
import { CategoryController } from "../../interface-adapters/controllers/CategoryController.js";
import { CategoryModel } from "../persistence/mongoose/models/CategoryModel.js";
import { MongoCategoryRepository } from "../persistence/mongoose/repositories/MongoCategoryRepository.js";


export class CategoryModule {
  private static categoryRepository: ICategoryRepository;

  static getCategoryRepository(): ICategoryRepository {
    if (!this.categoryRepository) {
      this.categoryRepository = new MongoCategoryRepository(CategoryModel);
    }
    return this.categoryRepository;
  }

  static getCreateCategoryUseCase(): CreateCategoryUseCase {
    return new CreateCategoryUseCase(this.getCategoryRepository());
  }

  static getGetAllCategoriesUseCase(): GetAllCategoriesUseCase {
    return new GetAllCategoriesUseCase(this.getCategoryRepository());
  }

  static getUpdateCategoryUseCase(): UpdateCategoryUseCase {
    return new UpdateCategoryUseCase(
      this.getCategoryRepository()
    );
  }

  static getDeleteCategoryUseCase(): DeleteCategoryUseCase {
    return new DeleteCategoryUseCase(
      this.getCategoryRepository()
    );
  }

  static getCategoryController(): CategoryController {
    return new CategoryController(
      this.getCreateCategoryUseCase(),
      this.getGetAllCategoriesUseCase(),
      this.getUpdateCategoryUseCase(),
      this.getDeleteCategoryUseCase(),
    );
  }
}