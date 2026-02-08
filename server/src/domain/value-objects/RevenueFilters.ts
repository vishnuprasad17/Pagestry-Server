export class RevenueFilters {
  constructor(
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly status?: string,
    public readonly paymentStatus?: string,
    public readonly paymentMethod?: string
  ) {}

  hasDateRange(): boolean {
    return !!this.startDate || !!this.endDate;
  }
}