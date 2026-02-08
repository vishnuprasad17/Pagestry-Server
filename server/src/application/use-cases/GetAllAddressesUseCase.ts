import { Address } from "../../domain/entities/Address.js";
import { AddressResponseDto } from "../dto/AddressDto.js";
import { IAddressRepository } from "../ports/IAddressRepository.js";

export class GetAllAddressesUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(userId: string): Promise<AddressResponseDto[]> {
    const addresses = await this.addressRepository.findByUserId(userId);
    return addresses.map(this.mapToResponseDto);
  }

  private mapToResponseDto(address: Address): AddressResponseDto {
    return address.getFormattedAddress();
  }
}