import { RefundNotAllowedError } from "../../domain/errors/AdminErrors.js";
import { DomainError } from "../../domain/errors/DomainError.js";
import { OrderNotFoundError } from "../../domain/errors/OrderErrors.js";
import { IPaymentService } from "../ports/IPaymentService.js";
import { IAdminUnitOfWork } from "../ports/IUnitOfWork.js";

export class ProcessRefundUseCase {
  constructor(
    private readonly unitOfWork: IAdminUnitOfWork,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(
    orderId: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; message: string; refundId?: string }> {
    await this.unitOfWork.begin();

    try {
      const orderRepo = this.unitOfWork.getOrderRepository();
      const bookRepo = this.unitOfWork.getBookRepository();

      const order = await orderRepo.findByOrderId(orderId);

      if (!order) {
        throw new OrderNotFoundError(orderId);
      }

      if (order.getPaymentDetails().method !== "RAZORPAY") {
        throw new RefundNotAllowedError("Refund is only available for Razorpay payments");
      }

      if (order.getPaymentDetails().status !== "SUCCESS") {
        throw new RefundNotAllowedError("Cannot refund unpaid order");
      }

      if (!order.getPaymentDetails().razorpayPaymentId) {
        throw new RefundNotAllowedError("Payment ID not found");
      }

      // Initiate refund with Razorpay
      const refundResult = await this.paymentService.initiateRefund(
        order.getPaymentDetails().razorpayPaymentId as string,
        amount || order.getTotalPrice()
      );

      if (!refundResult.success) {
        throw new DomainError("Refund initiation failed", 400);
      }

      // Update payment status
      await orderRepo.updatePaymentStatus(order.id.toString(), "REFUNDED");

      // Restore stock if not already done
      if (order.getStatus() !== "CANCELLED") {
        for (const item of order.getItems()) {
          await bookRepo.increaseStock(item.bookId.toString(), item.quantity);
        }
      }

      // Update order status
      await orderRepo.updateStatus(order.id.toString(), "CANCELLED");

      if (reason) {
        await orderRepo.updateCancellation(order.id.toString(), reason, new Date());
      }

      await this.unitOfWork.commit();

      return {
        success: true,
        message: "Refund processed successfully",
        refundId: refundResult.refundId
      };
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}