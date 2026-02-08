export type PaymentMethod = "RAZORPAY" | "COD";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export class PaymentDetails {
  constructor(
    public readonly method: PaymentMethod,
    public status: PaymentStatus,
    public readonly amount: number,
    public readonly currency: string = "INR",
    public razorpayOrderId?: string,
    public razorpayPaymentId?: string,
    public razorpaySignature?: string,
    public paidAt?: Date,
    public failureReason?: string
  ) {
    if (amount < 0) {
      throw new Error("Payment amount cannot be negative");
    }
  }

  isPaid(): boolean {
    return this.status === "SUCCESS";
  }

  isRefunded(): boolean {
    return this.status === "REFUNDED";
  }
}