import { Order } from "../../domain/entities/Order.js";
import { OrderFilters, OrderStatus } from "../../domain/value-objects/OrderFilters.js";
import { PaymentMethod, PaymentStatus } from "../../domain/value-objects/PaymentDetails.js";
import { OrderResponseDto, PaginatedOrdersDto } from "../dto/OrderDto.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class GetFilteredOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(
    status?: string,
    paymentStatus?: string,
    paymentMethod?: string,
    startDate?: Date,
    endDate?: Date,
    searchQuery?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedOrdersDto> {
    const filters = new OrderFilters(
      page,
      limit,
      status as OrderStatus,
      paymentStatus as PaymentStatus,
      paymentMethod as PaymentMethod,
      startDate,
      endDate,
      searchQuery
    );

    const { orders, total } = await this.orderRepository.findFiltered(filters);

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