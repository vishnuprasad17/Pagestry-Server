import { RevenueFilters } from "../../domain/value-objects/RevenueFilters.js";
import { IOrderRepository } from "../ports/IOrderRepository.js";

export class ExportOrdersToCSVUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(filters: RevenueFilters): Promise<string> {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.paymentStatus) query["paymentDetails.status"] = filters.paymentStatus;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    const orders = await this.orderRepository.findOrdersWithPopulate(query, 0, 10000);

    // Create CSV
    const headers = [
      "Order ID", "Date", "Customer Name", "Email", "Phone",
      "Address", "City", "State", "Zip Code", "Items Count",
      "Total Amount", "Payment Method", "Payment Status", "Order Status"
    ];

    const rows = orders.map((order) => [
      order.orderId,
      new Date(order.createdAt).toLocaleDateString(),
      order.shippingAddress.fullName,
      order.email,
      order.shippingAddress.phone,
      order.shippingAddress.addressLine1,
      order.shippingAddress.city,
      order.shippingAddress.state,
      order.shippingAddress.zipCode,
      order.items.length,
      order.totalPrice,
      order.paymentDetails.method,
      order.paymentDetails.status,
      order.status
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }
}