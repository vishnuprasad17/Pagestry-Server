import { ICategoryRepository } from "../ports/ICategoryRepository.js";



export class DeleteCategoryUseCase {
    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    execute(id: string): Promise<void> {
        return this.categoryRepository.delete(id);
    }
}