import { Category } from "../../domain/entities/Category.js";
import { ICategoryRepository } from "../ports/ICategoryRepository.js";

export class GetAllCategoriesUseCase {
    constructor(
        private categoryRepository: ICategoryRepository
    ) {}

    async execute(): Promise<Category[]> {
        const categories = await this.categoryRepository.getAll();

        return categories;
    }
}