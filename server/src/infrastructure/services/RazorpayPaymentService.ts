import Razorpay from "razorpay";
import crypto from "crypto";
import { CreateRazorpayOrderData, CreateRazorpayOrderResult, IPaymentService, RefundResult, VerifySignatureData } from "../../application/ports/IPaymentService.js";

export class RazorpayPaymentService implements IPaymentService {
  private razorpay: Razorpay;

  constructor() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createRazorpayOrder(data: CreateRazorpayOrderData): Promise<CreateRazorpayOrderResult> {
    try {
      const options = {
        amount: Math.round(data.amount * 100), // Convert to paise
        currency: data.currency,
        receipt: data.receipt,
        notes: data.notes || {}
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        orderId: order.id
      };
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      return {
        success: false,
        message: "Failed to create payment order"
      };
    }
  }

  verifyPaymentSignature(data: VerifySignatureData): boolean {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(text)
        .digest("hex");

      return generated_signature === razorpay_signature;
    } catch (error) {
      console.error("Signature verification failed:", error);
      return false;
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(payload)
        .digest("hex");

      return expectedSignature === signature;
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return false;
    }
  }

  async initiateRefund(paymentId: string, amount?: number): Promise<RefundResult> {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined
      });

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount! / 100
      };
    } catch (error) {
      console.error("Refund initiation failed:", error);
      return {
        success: false,
        message: "Failed to initiate refund"
      };
    }
  }
}