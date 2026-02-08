import { InvalidCategoryDataError } from "../errors/CategoryErrors.js";

export class Category {
  private constructor(
    public readonly id: string,
    private name: string,
    private icon: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(data: { name: string; icon: string }): Category {
    // Validate on creation
    if (!data.name || data.name.trim().length === 0) {
      throw new InvalidCategoryDataError("Category name is required");
    }
    if (!data.icon || data.icon.trim().length === 0) {
      throw new InvalidCategoryDataError("Category icon is required");
    }

    return new Category("", data.name, data.icon, new Date());
  }

  static reconstitute(data: {
    id: string;
    name: string;
    icon: string;
    createdAt: Date;
  }): Category {
    return new Category(data.id, data.name, data.icon, data.createdAt);
  }

  getName(): string {
    return this.name;
  }

  getIcon(): string {
    return this.icon;
  }

  matchesNameOrIcon(name: string, icon: string): boolean {
    return this.getName() === name || this.getIcon() === icon;
  }

  updateDetails(updates: { name?: string; icon?: string }): void {
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new InvalidCategoryDataError("Category name is required");
      }
      this.name = updates.name;
    }

    if (updates.icon !== undefined) {
      if (!updates.icon || updates.icon.trim().length === 0) {
        throw new InvalidCategoryDataError("Category icon is required");
      }
      this.icon = updates.icon;
    }
  }
}
