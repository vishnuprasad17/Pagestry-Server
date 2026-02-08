import { AuditAction } from "../../domain/value-objects/AuditAction.js";

export interface OrderStatsDto {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  placedOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  failedOrders: number;
}
export interface AdminStatsDto {
  orderStats: OrderStatsDto;
  topCustomers: topCustomerDto[];
  totalBooks: number;
}

export interface topCustomerDto {
  userId: string;
  name: string;
  email: string;
  profileImage?: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: Date;
}

export interface AnalyticsDto {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  razorpayRevenue: number;
  codRevenue: number;
}

export interface DailyBreakdownDto {
  _id: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface RevenueAnalyticsDto {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    razorpayRevenue: number;
    codRevenue: number;
  };
  dailyBreakdown: Array<{
    _id: string;
    totalRevenue: number;
    totalOrders: number;
  }>;
}

export interface DailyReport {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  placedOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  razorpayOrders: number;
  codOrders: number;
}

export interface DailyReportDto extends DailyReport {
  date: string;
}

export interface MonthySales {
  month: number;
  totalRevenue: number;
  orderCount: number;
}

export interface MonthlyRevenueDto {
  success: boolean;
  year: number;
  data: Array<{
    month: string;
    revenue: number;
    orderCount: number;
  }>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageMonthlyRevenue: number;
  };
}

export interface YearlySales {
  totalRevenue: number;
  orderCount: number;
}

export interface YearlyRevenueDto {
  success: boolean;
  data: Array<{
    year: number;
    revenue: number;
    orders: number;
  }>;
}

export interface AuditLogUserDto {
  id: string;
  name: string;
  username: string;
  role: "user" | "admin";
  isBlocked: boolean;
}

export interface AuditLogResponseDto {
  id: string;
  action: AuditAction;
  createdAt: Date;

  user: AuditLogUserDto | null;
  admin: AuditLogUserDto | null;
}

export interface PaginatedAuditLogsDto {
  auditLogs: AuditLogResponseDto[];
  totalPages: number;
  currentPage: number;
}

export interface CloudinarySignatureDto {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}