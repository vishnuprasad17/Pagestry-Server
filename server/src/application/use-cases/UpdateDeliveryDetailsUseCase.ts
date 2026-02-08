import { DomainError } from "../../domain/errors/DomainError.js";
import { OrderNotFoundError } from "../../domain/errors/OrderErrors.js";
import { DeliveryDetails } from "../../domain/value-objects/DeliveryDetails.js";
import { OrderResponseDto } from "../dto/OrderDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class UpdateDeliveryDetailsUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(
    orderId: string,
    partner: string,
    trackingId: string,
    estimatedDeliveryDate?: Date
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findByOrderId(orderId);

    if (!order) {
      throw new OrderNotFoundError(orderId);
    }

    if (order.getStatus() !== "CONFIRMED") {
      throw new DomainError("Can only update delivery details for confirmed orders", 400);
    }

    const deliveryDetails = new DeliveryDetails(
      partner,
      trackingId,
      estimatedDeliveryDate || order.getDeliveryDetails()?.estimatedDeliveryDate as Date,
      order.getDeliveryDetails()?.deliveredAt
    );

    await this.orderRepository.updateDeliveryDetails(orderId, deliveryDetails);

    // Also update to SHIPPED
    await this.orderRepository.updateStatus(orderId, "SHIPPED");

    const updatedOrder = await this.orderRepository.findByOrderId(orderId);

    if (!updatedOrder) {
      throw new OrderNotFoundError(orderId);
    }
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
  }
}