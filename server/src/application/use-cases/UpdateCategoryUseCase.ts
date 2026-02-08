import { Category } from "../../domain/entities/Category.js";
import { CategoryNotFoundError, InvalidCategoryDataError } from "../../domain/errors/CategoryErrors.js";
import { UpdateCategoryDto } from "../dto/CategoryDto.js";
import { ICategoryRepository } from "../ports/ICategoryRepository.js";


export class UpdateCategoryUseCase {
    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findById(id);

        if (!category) {
            throw new CategoryNotFoundError(id);
        }

        const categories = await this.categoryRepository.getAll();
        const existingOtherCategories = categories.filter(category => category.id !== id);
        const existingData = existingOtherCategories.find(category => category.matchesNameOrIcon(dto.name, dto.icon));
        if (existingData) {
            throw new InvalidCategoryDataError('Category already exists');
        }

        category.updateDetails({
            name: dto.name,
            icon: dto.icon
        });

        await this.categoryRepository.save(category);
        return category;
    }
}