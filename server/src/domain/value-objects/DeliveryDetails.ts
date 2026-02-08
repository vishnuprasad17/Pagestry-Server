export class DeliveryDetails {
  constructor(
    public readonly partner: string,
    public readonly trackingId: string,
    public readonly estimatedDeliveryDate: Date,
    public deliveredAt?: Date
  ) {}

  isDelivered(): boolean {
    return !!this.deliveredAt;
  }
}