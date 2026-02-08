import { IBannerRepository } from "../../../../application/ports/IBannerRepository.js";
import { Banner } from "../../../../domain/entities/Banner.js";
import { BannerFilters } from "../../../../domain/value-objects/BannerFilters.js";
import { BannerMapper } from "../mappers/BannerMapper.js";
import { BannerModel } from "../models/BannerModel.js";

export class MongoBannerRepository implements IBannerRepository {
  constructor(private readonly model: typeof BannerModel) {}

  async findById(id: string): Promise<Banner | null> {
    const document = await this.model.findById(id).exec();
    return document ? BannerMapper.toDomain(document) : null;
  }

  async findAll(): Promise<Banner[]> {
    const documents = await this.model
      .find()
      .sort({ createdAt: -1 })
      .exec();
    
    return documents.map(doc => BannerMapper.toDomain(doc));
  }

  async findActive(): Promise<Banner[]> {
    const documents = await this.model
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();
    
    return documents.map(doc => BannerMapper.toDomain(doc));
  }

  async findFiltered(filters: BannerFilters): Promise<{ banners: Banner[], total: number }> {
    const filter: any = {};

    const activeFilter = filters.getActiveFilter();
    if (activeFilter !== undefined) {
      filter.isActive = activeFilter;
    }

    const [documents, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(filters.getSkip())
        .limit(filters.limit)
        .exec(),
      this.model.countDocuments(filter)
    ]);

    return {
      banners: documents.map(doc => BannerMapper.toDomain(doc)),
      total
    };
  }

  async save(banner: Banner): Promise<Banner> {
    const persistenceData = BannerMapper.toPersistence(banner);

    if (banner.id) {
      await this.model.findByIdAndUpdate(
        banner.id,
        { $set: persistenceData },
        { new: true, runValidators: true }
      );
      return banner;
    } else {
      const newDoc = new this.model(persistenceData);
      await newDoc.save();

      return BannerMapper.toDomain(newDoc);
    }
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}