import { DeliveryDetails } from "../value-objects/DeliveryDetails.js";
import { OrderStatus } from "../value-objects/OrderFilters.js";
import { OrderItem } from "../value-objects/OrderItem.js";
import { PaymentDetails, PaymentStatus } from "../value-objects/PaymentDetails.js";
import { ShippingAddress } from "../value-objects/ShippingAddress.js";

export class Order {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly userId: string,
    public readonly email: string,
    private shippingAddress: ShippingAddress,
    private items: OrderItem[],
    private subtotal: number,
    private deliveryCharge: number,
    private totalPrice: number,
    private status: OrderStatus,
    private paymentDetails: PaymentDetails,
    private readonly idempotencyKey: string,
    private deliveryDetails: DeliveryDetails | null = null,
    private cancellationReason?: string,
    private cancelledAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  getItems(): readonly OrderItem[] {
    return [...this.items];
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getPaymentDetails(): PaymentDetails {
    return this.paymentDetails;
  }

  getShippingAddress(): ShippingAddress {
    return this.shippingAddress;
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  getDeliveryCharge(): number {
    return this.deliveryCharge;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  getDeliveryDetails(): DeliveryDetails | null {
    return this.deliveryDetails;
  }

  getIdempotencyKey(): string {
    return this.idempotencyKey;
  }

  getCancellationInfo(): { reason?: string; cancelledAt?: Date } {
    return { reason: this.cancellationReason, cancelledAt: this.cancelledAt };
  }

  canBeCancelled(): boolean {
    return ["PENDING", "PLACED", "CONFIRMED"].includes(this.status);
  }

  cancel(reason: string): void {
    if (!this.canBeCancelled()) {
      throw new Error(`Order cannot be cancelled in ${this.status} status`);
    }
    this.status = "CANCELLED";
    this.cancellationReason = reason;
    this.cancelledAt = new Date();
  }

  updateStatus(newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ["PLACED", "FAILED", "CANCELLED"],
      PLACED: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
      FAILED: []
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${this.status} to ${newStatus}`);
    }

    this.status = newStatus;
  }

  updatePaymentStatus(
    newStatus: PaymentStatus,
    additionalDetails?: Partial<PaymentDetails>
  ): void {
    this.paymentDetails.status = newStatus;
    if (additionalDetails) {
      Object.assign(this.paymentDetails, additionalDetails);
    }
  }

  updateDeliveryDetails(details: DeliveryDetails): void {
    this.deliveryDetails = details;
  }

  markAsDelivered(): void {
    if (this.status !== "SHIPPED") {
      throw new Error("Only shipped orders can be marked as delivered");
    }
    this.status = "DELIVERED";
    if (this.deliveryDetails) {
      this.deliveryDetails.deliveredAt = new Date();
    }
  }

  isPaymentPending(): boolean {
    return this.paymentDetails.status === "PENDING";
  }

  isPaymentSuccessful(): boolean {
    return this.paymentDetails.status === "SUCCESS";
  }

  requiresRefund(): boolean {
    return (
      this.paymentDetails.method === "RAZORPAY" &&
      this.paymentDetails.status === "SUCCESS" &&
      this.status === "CANCELLED"
    );
  }
}