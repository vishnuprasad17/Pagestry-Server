import mongoose from "mongoose";
import { Address } from "../../../../domain/entities/Address.js";

export class AddressMapper {
  static toDomain(document: any): Address {
    return Address.reconstitute({
      id: document._id.toString(),
      userId: document.userId.toString(),
      fullName: document.fullName,
      phone: document.phone,
      addressLine1: document.addressLine1,
      city: document.city,
      state: document.state,
      country: document.country,
      zipCode: document.zipCode,
      isDefault: document.isDefault,
      addressLine2: document.addressLine2,
      landmark: document.landmark,
      createdAt: document.createdAt
    });
  }

  static toPersistence(address: Address): any {
    return {
      userId: new mongoose.Types.ObjectId(address.userId),
      fullName: address.getFullName(),
      phone: address.getPhone(),
      addressLine1: address.getAddressLine1(),
      addressLine2: address.getAddressLine2(),
      landmark: address.getLandmark(),
      city: address.getCity(),
      state: address.getState(),
      country: address.getCountry(),
      zipCode: address.getZipCode(),
      isDefault: address.isDefaultAddress()
    };
  }
}