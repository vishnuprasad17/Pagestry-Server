import { Category } from "../../domain/entities/Category.js";
import { InvalidCategoryDataError } from "../../domain/errors/CategoryErrors.js";
import { CreateCategoryDto } from "../dto/CategoryDto.js";
import { ICategoryRepository } from "../ports/ICategoryRepository.js";

export class CreateCategoryUseCase {
    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(dto: CreateCategoryDto): Promise<Category> {
        const categories = await this.categoryRepository.getAll();
        const existingCategory = categories.find(category => category.matchesNameOrIcon(dto.name, dto.icon));
        if (existingCategory) {
            throw new InvalidCategoryDataError('Category already exists');
        }
        
        const category = Category.create({
            name: dto.name,
            icon: dto.icon
        });
        await this.categoryRepository.save(category);
        return category;
    }
}