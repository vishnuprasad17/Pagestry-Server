import { AddressNotFoundError } from "../../domain/errors/AddressErrors.js";
import { AddressResponseDto } from "../dto/AddressDto.js";
import { IAddressRepository } from "../ports/IAddressRepository.js";

export class GetAddressByIdUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(addressId: string): Promise<AddressResponseDto> {
    const address = await this.addressRepository.findById(addressId);

    if (!address) {
      throw new AddressNotFoundError(addressId);
    }

    return address.getFormattedAddress();
  }
}