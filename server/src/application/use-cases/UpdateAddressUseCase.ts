import { AddressNotFoundError, DefaultAddressRequiredError, UnauthorizedAccessError } from "../../domain/errors/AddressErrors.js";
import { AddressResponseDto, UpdateAddressDto } from "../dto/AddressDto.js";
import { IAddressUnitOfWork } from "../ports/IUnitOfWork.js";

export class UpdateAddressUseCase {
  constructor(private readonly unitOfWork: IAddressUnitOfWork) {}

  async execute(
    addressId: string,
    userId: string,
    dto: UpdateAddressDto
  ): Promise<AddressResponseDto> {
    await this.unitOfWork.begin();

    try {
      const addressRepo = this.unitOfWork.getAddressRepository();
      const address = await addressRepo.findById(addressId);

      if (!address) {
        throw new AddressNotFoundError(addressId);
      }

      // Verify ownership
      if (address.userId !== userId) {
        throw new UnauthorizedAccessError();
      }

      // Handle default status change
      if (dto.isDefault === true && !address.isDefaultAddress()) {
        await addressRepo.removeAllDefaults(userId);
        address.makeDefault();
      }

      if (dto.isDefault === false && address.isDefaultAddress()) {
        throw new DefaultAddressRequiredError();
      }

      // Update other fields
      address.updateDetails({
        fullName: dto.fullName,
        phone: dto.phone,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        landmark: dto.landmark,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        zipCode: dto.zipCode
      });

      await addressRepo.save(address);
      await this.unitOfWork.commit();

      return address.getFormattedAddress();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}