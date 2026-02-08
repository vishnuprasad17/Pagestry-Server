import { PaymentVerificationError } from "../../domain/errors/OrderErrors.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";
import { IPaymentService } from "../ports/IPaymentService.js";

export class HandleWebhookUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(event: any, signature: string, rawBody: string): Promise<{ success: boolean; message: string }> {
    // Verify webhook signature
    const isValid = this.paymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new PaymentVerificationError("Invalid webhook signature");
    }

    const eventType = event.event;
    const payload = event.payload.payment.entity;

    switch (eventType) {
      case "payment.captured":
        await this.handlePaymentCaptured(payload);
        break;
      case "payment.failed":
        await this.handlePaymentFailed(payload);
        break;
      case "refund.created":
        await this.handleRefundCreated(payload);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return { success: true, message: "Webhook processed" };
  }

  private async handlePaymentCaptured(payload: any): Promise<void> {
    const order = await this.orderRepository.findByRazorpayOrderId(payload.order_id);
    if (!order || order.isPaymentSuccessful()) return;

    order.updatePaymentStatus("SUCCESS", {
      razorpayPaymentId: payload.id,
      paidAt: new Date(payload.created_at * 1000)
    });

    await this.orderRepository.save(order);
  }

  private async handlePaymentFailed(payload: any): Promise<void> {
    const order = await this.orderRepository.findByRazorpayOrderId(payload.order_id);
    if (!order) return;

    order.updatePaymentStatus("FAILED", {
      razorpayPaymentId: payload.id,
      failureReason: payload.error_description || "Payment failed"
    });
    order.updateStatus("FAILED");

    await this.orderRepository.save(order);
  }

  private async handleRefundCreated(payload: any): Promise<void> {
    const order = await this.orderRepository.findByRazorpayPaymentId(payload.payment_id);
    if (!order) return;

    order.updatePaymentStatus("REFUNDED");
    await this.orderRepository.save(order);
  }
}