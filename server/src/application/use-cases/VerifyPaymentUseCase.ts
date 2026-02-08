import { OrderNotFoundError } from "../../domain/errors/OrderErrors.js";
import { VerifyPaymentDto, VerifyPaymentResult } from "../dto/OrderDto.js";
import { IPaymentService } from "../ports/IPaymentService.js";
import { IOrderUnitOfWork } from "../ports/IUnitOfWork.js";

export class VerifyPaymentUseCase {
  constructor(
    private readonly unitOfWork: IOrderUnitOfWork,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(dto: VerifyPaymentDto): Promise<VerifyPaymentResult> {
    await this.unitOfWork.begin();

    try {
      const orderRepo = this.unitOfWork.getOrderRepository();
      const order = await orderRepo.findByOrderId(dto.orderId);

      if (!order) {
        throw new OrderNotFoundError(dto.orderId);
      }

      // Check if already processed
      if (order.isPaymentSuccessful()) {
        return {
          success: true,
          order,
          message: "Payment already verified"
        };
      }

      // Verify payment signature
      const isValid = this.paymentService.verifyPaymentSignature({
        razorpay_order_id: dto.razorpay_order_id,
        razorpay_payment_id: dto.razorpay_payment_id,
        razorpay_signature: dto.razorpay_signature
      });

      if (!isValid) {
        order.updatePaymentStatus("FAILED", { failureReason: "Invalid payment signature" });
        order.updateStatus("FAILED");
        await orderRepo.save(order);
        await this.unitOfWork.commit();

        return {
          success: false,
          message: "Payment verification failed"
        };
      }

      // Reduce stock
      const bookRepo = this.unitOfWork.getBookRepository();
      const outOfStockIds: string[] = [];

      for (const item of order.getItems()) {
        const hasStock = await bookRepo.checkStock(item.bookId, item.quantity);
        if (!hasStock) {
          outOfStockIds.push(item.bookId);
        }
      }

      if (outOfStockIds.length > 0) {
        // Initiate refund
        await this.paymentService.initiateRefund(dto.razorpay_payment_id);
        
        order.updatePaymentStatus("REFUNDED", { failureReason: "Items out of stock" });
        order.updateStatus("FAILED");
        await orderRepo.save(order);
        await this.unitOfWork.commit();

        return {
          success: false,
          outOfStockIds,
          message: "Items out of stock. Refund initiated."
        };
      }

      // Reduce stock for all items
      for (const item of order.getItems()) {
        await bookRepo.reduceStock(item.bookId, item.quantity);
      }

      // Update payment and order status
      order.updatePaymentStatus("SUCCESS", {
        razorpayPaymentId: dto.razorpay_payment_id,
        razorpaySignature: dto.razorpay_signature,
        paidAt: new Date()
      });
      order.updateStatus("PLACED");

      // Clear cart
      const cartRepo = this.unitOfWork.getCartRepository();
      await cartRepo.clearCart(order.userId);

      await orderRepo.save(order);
      await this.unitOfWork.commit();

      return {
        success: true,
        order,
        message: "Payment verified and order placed successfully"
      };
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}