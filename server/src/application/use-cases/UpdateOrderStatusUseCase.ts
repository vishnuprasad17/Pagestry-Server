import { InvalidStatusTransitionError } from "../../domain/errors/AdminErrors.js";
import { DomainError } from "../../domain/errors/DomainError.js";
import { OrderNotFoundError } from "../../domain/errors/OrderErrors.js";
import { OrderStatus } from "../../domain/value-objects/OrderFilters.js";
import { OrderStatusTransition } from "../../domain/value-objects/OrderStatusTransition.js";
import { OrderResponseDto } from "../dto/OrderDto.js";
import { IAdminUnitOfWork } from "../ports/IUnitOfWork.js";

export class UpdateOrderStatusUseCase {
  constructor(private readonly unitOfWork: IAdminUnitOfWork) {}

  async execute(orderId: string, newStatus: OrderStatus): Promise<OrderResponseDto> {
    await this.unitOfWork.begin();

    try {
      const orderRepo = this.unitOfWork.getOrderRepository();
      const order = await orderRepo.findByOrderId(orderId);

      if (!order) {
        throw new OrderNotFoundError(orderId);
      }

      // Validate status transition
      if (!OrderStatusTransition.isValidTransition(order.getStatus(), newStatus)) {
        throw new InvalidStatusTransitionError(order.getStatus(), newStatus);
      }

      // If marking as shipped, check if delivery details are present
      if (newStatus === "SHIPPED") {
        if (!order.getDeliveryDetails()) {
          throw new DomainError("Delivery details must be added before shipping the order", 400);
        }
      }

      // If marking as delivered
      if (newStatus === "DELIVERED") {
        await orderRepo.updatePaymentStatus(orderId, "SUCCESS");
      }

      // Update status
      await orderRepo.updateStatus(orderId, newStatus);

      const updatedOrder = await orderRepo.findByOrderId(orderId);

      if (!updatedOrder) {
        throw new OrderNotFoundError(orderId);
      }

      await this.unitOfWork.commit();

      return {
        id: updatedOrder.id,
        orderId: updatedOrder.orderId,
        userId: updatedOrder.userId,
        email: updatedOrder.email,
        items: updatedOrder.getItems().map((item) => ({
          bookId: item.bookId,
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.getTotal(),
          category: item.category,
          coverImage: item.coverImage
        })),
        subtotal: updatedOrder.getSubtotal(),
        deliveryCharge: updatedOrder.getDeliveryCharge(),
        totalPrice: updatedOrder.getTotalPrice(),
        status: updatedOrder.getStatus(),
        shippingAddress: updatedOrder.getShippingAddress(),
        paymentDetails: updatedOrder.getPaymentDetails(),
        deliveryDetails: updatedOrder.getDeliveryDetails(),
        cancellationInfo: updatedOrder.getCancellationInfo(),
        createdAt: updatedOrder.createdAt,
        updatedAt: updatedOrder.updatedAt
      };
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}