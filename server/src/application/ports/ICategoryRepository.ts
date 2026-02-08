import { Category } from "../../domain/entities/Category.js";

export interface ICategoryRepository {
    getAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    save(category: Category): Promise<Category>;
    delete(id: string): Promise<void>;
}