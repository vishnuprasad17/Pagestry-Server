export class ShippingAddress {
  constructor(
    public readonly fullName: string,
    public readonly phone: string,
    public readonly addressLine1: string,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly zipCode: string,
    public readonly addressLine2?: string,
    public readonly landmark?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.fullName || !this.phone || !this.addressLine1) {
      throw new Error("Missing required address fields");
    }
    if (!this.city || !this.state || !this.country || !this.zipCode) {
      throw new Error("Missing required location fields");
    }
  }

  getFormattedAddress(): string {
    const parts = [
      this.addressLine1,
      this.addressLine2,
      this.landmark,
      this.city,
      this.state,
      this.country,
      this.zipCode
    ].filter(Boolean);
    return parts.join(", ");
  }
}