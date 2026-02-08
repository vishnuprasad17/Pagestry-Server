import { Address } from "../../domain/entities/Address.js";
import { AddressLimitExceededError } from "../../domain/errors/AddressErrors.js";
import { AddressLimit } from "../../domain/value-objects/AddressLimit.js";
import { AddressResponseDto, CreateAddressDto } from "../dto/AddressDto.js";
import { IAddressUnitOfWork } from "../ports/IUnitOfWork.js";

export class CreateAddressUseCase {
  constructor(private readonly unitOfWork: IAddressUnitOfWork) {}

  async execute(dto: CreateAddressDto): Promise<AddressResponseDto> {
    await this.unitOfWork.begin();

    try {
      const addressRepo = this.unitOfWork.getAddressRepository();

      // Check address limit
      const existingCount = await addressRepo.countByUserId(dto.userId);
      if (!AddressLimit.canAddAddress(existingCount)) {
        throw new AddressLimitExceededError();
      }

      // Determine if this should be default
      let makeDefault = dto.isDefault ?? false;

      // First address should always be default
      if (existingCount === 0) {
        makeDefault = true;
      }

      // If user wants new default, remove existing defaults
      if (makeDefault) {
        await addressRepo.removeAllDefaults(dto.userId);
      }

      // Create address
      const address = Address.create({
        userId: dto.userId,
        fullName: dto.fullName,
        phone: dto.phone,
        addressLine1: dto.addressLine1,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        zipCode: dto.zipCode,
        isDefault: makeDefault,
        addressLine2: dto.addressLine2,
        landmark: dto.landmark
      });

      await addressRepo.save(address);
      await this.unitOfWork.commit();

      return {
        id: address.id,
        fullName: address.getFullName(),
        phone: address.getPhone(),
        addressLine1: address.getAddressLine1(),
        addressLine2: address.getAddressLine2(),
        landmark: address.getLandmark(),
        city: address.getCity(),
        state: address.getState(),
        country: address.getCountry(),
        zipCode: address.getZipCode(),
        isDefault: address.isDefaultAddress(),
        createdAt: address.createdAt
    };
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}