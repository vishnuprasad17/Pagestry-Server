import { Category } from "../../../../domain/entities/Category.js";

export class CategoryMapper {
    static toDomain(document: any): Category {
        return Category.reconstitute({
            id: document._id.toString(),
            name: document.name,
            icon: document.icon,
            createdAt: document.createdAt
        });
    }

    static toPersistence(category: Category): any {
        return {
          name: category.getName(),
          icon: category.getIcon()
        };
      }
}