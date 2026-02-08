import { Order } from "../../domain/entities/Order.js";
import { DeliveryDetails } from "../../domain/value-objects/DeliveryDetails.js";
import { OrderStatus } from "../../domain/value-objects/OrderFilters.js";
import { PaymentDetails, PaymentMethod } from "../../domain/value-objects/PaymentDetails.js";
import { ShippingAddress } from "../../domain/value-objects/ShippingAddress.js";

export interface CreateOrderDto {
  idempotencyKey: string;
  userId: string;
  email: string;
  addressId: string;
  items: {
    bookId: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  deliveryCharge: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderResult {
  success: boolean;
  order?: Order;
  razorpayOrderId?: string;
  outOfStockIds?: string[];
  message: string;
}

export interface VerifyPaymentDto {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  order?: Order;
  outOfStockIds?: string[];
  message: string;
}

export interface OrderResponseDto {
  id: string;
  orderId: string;
  userId: string;
  email: string;
  items: {
    bookId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: string;
    coverImage: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  deliveryDetails: DeliveryDetails | null;
  cancellationInfo?: {
    reason?: string;
    cancelledAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedOrdersDto {
  orders: OrderResponseDto[];
  totalPages: number;
  currentPage: number;
  totalOrders: number;
}