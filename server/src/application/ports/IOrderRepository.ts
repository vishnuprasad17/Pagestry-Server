import { Order } from "../../domain/entities/Order.js";
import { TrendingBook } from "../../domain/entities/TrendingBook.js";
import { DeliveryDetails } from "../../domain/value-objects/DeliveryDetails.js";
import { OrderFilters, OrderStatus } from "../../domain/value-objects/OrderFilters.js";
import { AnalyticsDto, DailyBreakdownDto, DailyReport, MonthySales, OrderStatsDto, YearlySales } from "../dto/AdminDto.js";

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByOrderId(orderId: string): Promise<Order | null>;
  findByIdempotencyKey(key: string): Promise<Order | null>;
  findByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null>;
  findByRazorpayPaymentId(razorpayPaymentId: string): Promise<Order | null>;
  findByEmail(email: string, skip: number, limit: number): Promise<Order[]>;
  findFiltered(filters: OrderFilters): Promise<{ orders: Order[], total: number }>;
  save(order: Order): Promise<Order>;
  countByEmail(email: string): Promise<number>;
  getTrendingBooks(daysBack: number, limit: number): Promise<TrendingBook[]>;

  // Admin related methods
  updateStatus(orderId: string, status: OrderStatus): Promise<void>;
  updatePaymentStatus(orderId: string, status: string, additionalData?: any): Promise<void>;
  updateDeliveryDetails(orderId: string, details: DeliveryDetails): Promise<void>;
  updateCancellation(orderId: string, reason: string, cancelledAt: Date): Promise<void>;
  getOrderStats(): Promise<OrderStatsDto>;
  getTopCustomers(): Promise<any[]>;
  getRevenueAnalytics(basePipeline: any[]): Promise<AnalyticsDto[]>;
  getDailyBreakdown(basePipeline: any[]): Promise<DailyBreakdownDto[]>;
  getDailyReport(startDate: Date, endDate: Date): Promise<DailyReport[]>;
  getMonthlySales(startDate: Date, endDate: Date): Promise<MonthySales[]>;
  getYearlySales(startDate: Date, endDate: Date): Promise<YearlySales>;
  findOrdersWithPopulate(query: any, skip: number, limit: number): Promise<any[]>;
}