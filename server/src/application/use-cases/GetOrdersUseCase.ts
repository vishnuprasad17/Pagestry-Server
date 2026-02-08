import { Order } from "../../domain/entities/Order.js";
import { OrderResponseDto, PaginatedOrdersDto } from "../dto/OrderDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(email: string, page: number, limit: number): Promise<PaginatedOrdersDto> {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      this.orderRepository.findByEmail(email, skip, limit),
      this.orderRepository.countByEmail(email)
    ]);

    return {
      orders: orders.map(this.mapToResponseDto),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalOrders: total
    };
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
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