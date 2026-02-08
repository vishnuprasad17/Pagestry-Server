export class AddressLimit {
  private static readonly MAX_ADDRESSES = 4;

  static canAddAddress(currentCount: number): boolean {
    return currentCount < this.MAX_ADDRESSES;
  }

  static getMaxAddresses(): number {
    return this.MAX_ADDRESSES;
  }

  static getRemainingSlots(currentCount: number): number {
    return Math.max(0, this.MAX_ADDRESSES - currentCount);
  }
}