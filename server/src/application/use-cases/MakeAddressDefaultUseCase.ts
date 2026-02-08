import { AddressNotFoundError, UnauthorizedAccessError } from "../../domain/errors/AddressErrors.js";
import { AddressResponseDto } from "../dto/AddressDto.js";
import { IAddressUnitOfWork } from "../ports/IUnitOfWork.js";

export class MakeAddressDefaultUseCase {
  constructor(private readonly unitOfWork: IAddressUnitOfWork) {}

  async execute(addressId: string, userId: string): Promise<AddressResponseDto> {
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

      // If already default, nothing to do
      if (address.isDefaultAddress()) {
        await this.unitOfWork.commit();
        return address.getFormattedAddress();
      }

      // Remove all defaults and make this one default
      await addressRepo.removeAllDefaults(userId);
      address.makeDefault();
      await addressRepo.save(address);

      await this.unitOfWork.commit();
      return address.getFormattedAddress();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}