import { IAuthorRepository } from "../../../../application/ports/IAuthorRepository.js";
import { Author } from "../../../../domain/entities/Author.js";
import { AuthorFilters } from "../../../../domain/value-objects/AuthorFilters.js";
import { AuthorMapper } from "../mappers/AuthorMapper.js";
import { AuthorModel } from "../models/AuthorModel.js";

export class MongoAuthorRepository implements IAuthorRepository {
  constructor(private readonly model: typeof AuthorModel) {}

  async findById(id: string): Promise<Author | null> {
    const document = await this.model.findById(id).exec();
    return document ? AuthorMapper.toDomain(document) : null;
  }

  async findAll(): Promise<Author[]> {
    const documents = await this.model
      .find()
      .select("_id name profileImage")
      .exec();
    
    return documents.map(doc => AuthorMapper.toDomain(doc));
  }

  async findFiltered(filters: AuthorFilters): Promise<{ authors: Author[], total: number }> {
    const basePipeline: any[] = [];

    // Search filter
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      basePipeline.push({
        $match: {
          name: { $regex: filters.searchQuery, $options: "i" }
        }
      });
    }

    // Authors pipeline
    const authorsPipeline = [
      ...basePipeline,
      { $sort: filters.getSortOption() },
      { $skip: filters.getSkip() },
      { $limit: filters.limit }
    ];

    // Count pipeline
    const countPipeline = [...basePipeline, { $count: "total" }];

    const [authors, totalResult] = await Promise.all([
      this.model.aggregate(authorsPipeline),
      this.model.aggregate(countPipeline)
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
      authors: authors.map(doc => AuthorMapper.toDomain(doc)),
      total
    };
  }

  async findFeatured(): Promise<Author[]> {
    const documents = await this.model
      .find({ isFeatured: true })
      .select("_id name profileImage")
      .exec();
    
    return documents.map(doc => AuthorMapper.toDomain(doc));
  }

  async save(author: Author): Promise<Author> {
    const persistenceData = AuthorMapper.toPersistence(author);

    if (author.id) {
      await this.model.findByIdAndUpdate(
        author.id,
        { $set: persistenceData },
        { new: true, runValidators: true }
      );
      return author;
    } else {
      const newDoc = new this.model(persistenceData);
      await newDoc.save();

      return AuthorMapper.toDomain(newDoc);
    }
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}