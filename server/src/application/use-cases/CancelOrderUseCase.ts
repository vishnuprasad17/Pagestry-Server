import { InvalidOrderStateError, OrderNotFoundError, UnauthorizedError } from "../../domain/errors/OrderErrors.js";
import { IPaymentService } from "../ports/IPaymentService.js";
import { IOrderUnitOfWork } from "../ports/IUnitOfWork.js";

export class CancelOrderUseCase {
  constructor(
    private readonly unitOfWork: IOrderUnitOfWork,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(orderId: string, uid: string, reason: string): Promise<{ success: boolean; message: string }> {
    await this.unitOfWork.begin();

    try {
      const userRepo = this.unitOfWork.getUserRepository();
      const user = await userRepo.findByFirebaseUid(uid);
      const orderRepo = this.unitOfWork.getOrderRepository();
      const order = await orderRepo.findByOrderId(orderId);

      if (!user) {
        throw new UnauthorizedError("You are not authorized to cancel this order");
      }

      const userId = user.id;

      if (!order) {
        throw new OrderNotFoundError(orderId);
      }

      if (order.userId !== userId) {
        throw new UnauthorizedError("You are not authorized to cancel this order");
      }

      if (!order.canBeCancelled()) {
        throw new InvalidOrderStateError(`Order cannot be cancelled in ${order.getStatus()} status`);
      }

      // Restore stock
      const bookRepo = this.unitOfWork.getBookRepository();
      for (const item of order.getItems()) {
        await bookRepo.increaseStock(item.bookId, item.quantity);
      }

      // If paid via Razorpay, initiate refund
      if (order.requiresRefund()) {
        const paymentDetails = order.getPaymentDetails();
        if (paymentDetails.razorpayPaymentId) {
          await this.paymentService.initiateRefund(paymentDetails.razorpayPaymentId);
          order.updatePaymentStatus("REFUNDED");
        }
      }

      order.cancel(reason);
      await orderRepo.save(order);
      await this.unitOfWork.commit();

      return {
        success: true,
        message: "Order cancelled successfully"
      };
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}