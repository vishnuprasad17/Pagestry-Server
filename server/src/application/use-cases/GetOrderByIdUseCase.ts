import { OrderNotFoundError } from "../../domain/errors/OrderErrors.js";
import { OrderResponseDto } from "../dto/OrderDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findByOrderId(orderId);

    if (!order) {
      throw new OrderNotFoundError(orderId);
    }

    return {
      id: order.id,
      orderId: order.orderId,
      userId: order.userId,
      email: order.email,
      items: order.getItems().map(item => ({
        bookId: item.bookId,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.getTotal(),
        category: item.category,
        coverImage: item.coverImage
      })),
      subtotal: order.getSubtotal(),
      deliveryCharge: order.getDeliveryCharge(),
      totalPrice: order.getTotalPrice(),
      status: order.getStatus(),
      shippingAddress: order.getShippingAddress(),
      paymentDetails: order.getPaymentDetails(),
      deliveryDetails: order.getDeliveryDetails(),
      cancellationInfo: order.getCancellationInfo(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }
}