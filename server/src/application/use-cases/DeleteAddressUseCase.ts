import { AddressNotFoundError } from "../../domain/errors/AddressErrors.js";
import { IAddressUnitOfWork } from "../ports/IUnitOfWork.js";

export class DeleteAddressUseCase {
  constructor(private readonly unitOfWork: IAddressUnitOfWork) {}

  async execute(addressId: string): Promise<void> {
    await this.unitOfWork.begin();

    try {
      const addressRepo = this.unitOfWork.getAddressRepository();
      const address = await addressRepo.findById(addressId);

      if (!address) {
        throw new AddressNotFoundError(addressId);
      }

      const userId = address.userId;
      const wasDefault = address.isDefaultAddress();

      // Delete the address
      await addressRepo.delete(addressId);

      // If deleted address was default, make another one default
      if (wasDefault) {
        const addresses = await addressRepo.findByUserId(userId);
        if (addresses.length > 0) {
          addresses[0].makeDefault();
          await addressRepo.save(addresses[0]);
        }
      }

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}