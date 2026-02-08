import { InvalidAddressDataError } from '../errors/AddressErrors.js';
import { AddressResponseDto } from '../../application/dto/AddressDto.js';

export class Address {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    private fullName: string,
    private phone: string,
    private addressLine1: string,
    private city: string,
    private state: string,
    private country: string,
    private zipCode: string,
    private isDefault: boolean,
    private addressLine2?: string,
    private landmark?: string,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: {
    userId: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault?: boolean;
    addressLine2?: string;
    landmark?: string;
  }): Address {
    // Validate on creation
    if (!data.fullName || data.fullName.trim().length === 0) {
      throw new InvalidAddressDataError("Full name is required");
    }
    if (!data.phone || data.phone.trim().length === 0) {
      throw new InvalidAddressDataError("Phone number is required");
    }
    if (data.phone.length < 10) {
      throw new InvalidAddressDataError("Invalid phone number");
    }
    if (!data.addressLine1 || data.addressLine1.trim().length === 0) {
      throw new InvalidAddressDataError("Address line 1 is required");
    }
    if (!data.city || data.city.trim().length === 0) {
      throw new InvalidAddressDataError("City is required");
    }
    if (!data.state || data.state.trim().length === 0) {
      throw new InvalidAddressDataError("State is required");
    }
    if (!data.country || data.country.trim().length === 0) {
      throw new InvalidAddressDataError("Country is required");
    }
    if (!data.zipCode || data.zipCode.trim().length === 0) {
      throw new InvalidAddressDataError("Zip code is required");
    }

    return new Address(
      "",
      data.userId,
      data.fullName,
      data.phone,
      data.addressLine1,
      data.city,
      data.state,
      data.country,
      data.zipCode,
      data.isDefault ?? false,
      data.addressLine2,
      data.landmark,
      new Date()
    );
  }

  static reconstitute(data: {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
    addressLine2?: string;
    landmark?: string;
    createdAt: Date;
  }): Address {
    return new Address(
      data.id,
      data.userId,
      data.fullName,
      data.phone,
      data.addressLine1,
      data.city,
      data.state,
      data.country,
      data.zipCode,
      data.isDefault,
      data.addressLine2,
      data.landmark,
      data.createdAt
    );
  }

  getFullName(): string {
    return this.fullName;
  }

  getPhone(): string {
    return this.phone;
  }

  getAddressLine1(): string {
    return this.addressLine1;
  }

  getAddressLine2(): string | undefined {
    return this.addressLine2;
  }

  getLandmark(): string | undefined {
    return this.landmark;
  }

  getCity(): string {
    return this.city;
  }

  getState(): string {
    return this.state;
  }

  getCountry(): string {
    return this.country;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  isDefaultAddress(): boolean {
    return this.isDefault;
  }

  makeDefault(): void {
    this.isDefault = true;
  }

  removeDefault(): void {
    this.isDefault = false;
  }

  updateDetails(updates: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  }): void {
    // Validate each field before updating
    if (updates.fullName !== undefined) {
      if (!updates.fullName || updates.fullName.trim().length === 0) {
        throw new InvalidAddressDataError("Full name is required");
      }
      this.fullName = updates.fullName;
    }

    if (updates.phone !== undefined) {
      if (!updates.phone || updates.phone.trim().length === 0) {
        throw new InvalidAddressDataError("Phone number is required");
      }
      if (updates.phone.length < 10) {
        throw new InvalidAddressDataError("Invalid phone number");
      }
      this.phone = updates.phone;
    }

    if (updates.addressLine1 !== undefined) {
      if (!updates.addressLine1 || updates.addressLine1.trim().length === 0) {
        throw new InvalidAddressDataError("Address line 1 is required");
      }
      this.addressLine1 = updates.addressLine1;
    }

    if (updates.city !== undefined) {
      if (!updates.city || updates.city.trim().length === 0) {
        throw new InvalidAddressDataError("City is required");
      }
      this.city = updates.city;
    }

    if (updates.state !== undefined) {
      if (!updates.state || updates.state.trim().length === 0) {
        throw new InvalidAddressDataError("State is required");
      }
      this.state = updates.state;
    }

    if (updates.country !== undefined) {
      if (!updates.country || updates.country.trim().length === 0) {
        throw new InvalidAddressDataError("Country is required");
      }
      this.country = updates.country;
    }

    if (updates.zipCode !== undefined) {
      if (!updates.zipCode || updates.zipCode.trim().length === 0) {
        throw new InvalidAddressDataError("Zip code is required");
      }
      this.zipCode = updates.zipCode;
    }

    // Optional fields - can be empty
    if (updates.addressLine2 !== undefined) {
      this.addressLine2 = updates.addressLine2;
    }

    if (updates.landmark !== undefined) {
      this.landmark = updates.landmark;
    }
  }

  getFormattedAddress(): AddressResponseDto {
    return {
      id: this.id,
      fullName: this.getFullName(),
      phone: this.getPhone(),
      addressLine1: this.getAddressLine1(),
      addressLine2: this.getAddressLine2(),
      landmark: this.getLandmark(),
      city: this.getCity(),
      state: this.getState(),
      country: this.getCountry(),
      zipCode: this.getZipCode(),
      isDefault: this.isDefaultAddress(),
      createdAt: this.createdAt
    };
  }
}