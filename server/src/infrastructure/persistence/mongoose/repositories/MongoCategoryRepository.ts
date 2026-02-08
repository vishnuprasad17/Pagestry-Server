import { ICategoryRepository } from "../../../../application/ports/ICategoryRepository.js";
import { CategoryModel } from "../models/CategoryModel.js";
import { Category } from "../../../../domain/entities/Category.js";
import { CategoryMapper } from "../mappers/CategoryMapper.js";

export class MongoCategoryRepository implements ICategoryRepository {
    constructor(
        private readonly model: typeof CategoryModel
    ) {}
    async getAll(): Promise<Category[]> {
        const documents = await this.model.find();
        return documents.map(doc => CategoryMapper.toDomain(doc));
    }

    async findById(id: string): Promise<Category | null> {
        const document = await this.model.findById(id);
        return document ? CategoryMapper.toDomain(document) : null;
    }

    async save(category: Category): Promise<Category> {
        const persistenceData = CategoryMapper.toPersistence(category);
    
        if (category.id) {
          await this.model.findByIdAndUpdate(
            category.id,
            { $set: persistenceData },
            { new: true, runValidators: true }
          );
          return category;
        } else {
          const newDoc = new this.model(persistenceData);
          await newDoc.save();

          return CategoryMapper.toDomain(newDoc);
        }
      }

    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }
}