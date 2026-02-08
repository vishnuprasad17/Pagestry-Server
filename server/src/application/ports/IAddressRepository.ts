import { Address } from "../../domain/entities/Address.js";
import { ShippingAddress } from "../../domain/value-objects/ShippingAddress.js";

export interface IAddressRepository {
  findById(addressId: string): Promise<Address | null>;
  findShippingAddressById(addressId: string): Promise<ShippingAddress | null>;
  findByUserId(userId: string): Promise<Address[]>;
  findDefaultByUserId(userId: string): Promise<Address | null>;
  countByUserId(userId: string): Promise<number>;
  save(address: Address): Promise<Address>;
  delete(addressId: string): Promise<void>;
  removeAllDefaults(userId: string): Promise<void>;
}