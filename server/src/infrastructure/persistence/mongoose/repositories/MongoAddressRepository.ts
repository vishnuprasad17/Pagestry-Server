import mongoose from "mongoose";
import { IAddressRepository } from "../../../../application/ports/IAddressRepository.js";
import { ShippingAddress } from "../../../../domain/value-objects/ShippingAddress.js";
import { AddressModel } from "../models/AddressModel.js";
import { Address } from "../../../../domain/entities/Address.js";
import { AddressMapper } from "../mappers/AddressMapper.js";

export class MongoAddressRepository implements IAddressRepository {
  constructor(
    private readonly model: typeof AddressModel,
    private readonly session?: mongoose.ClientSession
  ) {}

  async findById(addressId: string): Promise<Address | null> {
    const query = this.model.findById(addressId);
    if (this.session) query.session(this.session);

    const document = await query.exec();
    return document ? AddressMapper.toDomain(document) : null;
  }

  async findShippingAddressById(addressId: string): Promise<ShippingAddress | null> {
    const document = await this.model.findById(addressId).exec();
    
    if (!document) return null;

    return new ShippingAddress(
      document.fullName,
      document.phone,
      document.addressLine1,
      document.city,
      document.state,
      document.country,
      document.zipCode,
      document.addressLine2,
      document.landmark
    );
  }

  async findByUserId(userId: string): Promise<Address[]> {
    const query = this.model
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: -1 });

    if (this.session) query.session(this.session);

    const documents = await query.exec();
    return documents.map(doc => AddressMapper.toDomain(doc));
  }

  async findDefaultByUserId(userId: string): Promise<Address | null> {
    const query = this.model.findOne({ 
      userId: new mongoose.Types.ObjectId(userId),
      isDefault: true 
    });

    if (this.session) query.session(this.session);

    const document = await query.exec();
    return document ? AddressMapper.toDomain(document) : null;
  }

  async countByUserId(userId: string): Promise<number> {
    const query = this.model.countDocuments({ 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (this.session) query.session(this.session);

    return await query.exec();
  }

  async save(address: Address): Promise<Address> {
    const persistenceData = AddressMapper.toPersistence(address);
    const options = this.session ? { session: this.session } : {};

    if (address.id) {
      await this.model.findByIdAndUpdate(
        address.id,
        { $set: persistenceData },
        { new: true, ...options }
      );
      return address;
    } else {
      const [newDoc] = await this.model.create([persistenceData], options);

      return AddressMapper.toDomain(newDoc);
    }
  }

  async delete(addressId: string): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await this.model.findByIdAndDelete(addressId, options);
  }

  async removeAllDefaults(userId: string): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await this.model.updateMany(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { isDefault: false } },
      options
    );
  }
}