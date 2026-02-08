import { Request, Response } from "express";
import { GetAdminStatsUseCase } from "../../application/use-cases/GetAdminStatsUseCase.js";
import { GetRevenueAnalyticsUseCase } from "../../application/use-cases/GetRevenueAnalyticsUseCase.js";
import { GetDailyReportUseCase } from "../../application/use-cases/GetDailyReportUseCase.js";
import { GetMonthlyRevenueUseCase } from "../../application/use-cases/GetMonthlyRevenueUseCase.js";
import { GetYearlyRevenueUseCase } from "../../application/use-cases/GetYearlyRevenueUseCase.js";
import { BlockUserUseCase } from "../../application/use-cases/BlockUserUseCase.js";
import { UnblockUserUseCase } from "../../application/use-cases/UnblockUserUseCase.js";
import { GetAuditLogsUseCase } from "../../application/use-cases/GetAuditLogsUseCase.js";
import { SendPasswordResetLinkUseCase } from "../../application/use-cases/SendPasswordResetLinkUseCase.js";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/UpdateOrderStatusUseCase.js";
import { UpdateDeliveryDetailsUseCase } from "../../application/use-cases/UpdateDeliveryDetailsUseCase.js";
import { ProcessRefundUseCase } from "../../application/use-cases/ProcessRefundUseCase.js";
import { ExportOrdersToCSVUseCase } from "../../application/use-cases/ExportOrdersToCSVUseCase.js";
import { GetCloudinarySignatureUseCase } from "../../application/use-cases/GetCloudinarySignatureUseCase.js";
import { RevenueFilters } from "../../domain/value-objects/RevenueFilters.js";
import { OrderStatus } from "../../domain/value-objects/OrderFilters.js";

export class AdminController {
  constructor(
    private readonly getAdminStatsUseCase: GetAdminStatsUseCase,
    private readonly getRevenueAnalyticsUseCase: GetRevenueAnalyticsUseCase,
    private readonly getDailyReportUseCase: GetDailyReportUseCase,
    private readonly getMonthlyRevenueUseCase: GetMonthlyRevenueUseCase,
    private readonly getYearlyRevenueUseCase: GetYearlyRevenueUseCase,
    private readonly blockUserUseCase: BlockUserUseCase,
    private readonly unblockUserUseCase: UnblockUserUseCase,
    private readonly getAuditLogsUseCase: GetAuditLogsUseCase,
    private readonly sendPasswordResetLinkUseCase: SendPasswordResetLinkUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly updateDeliveryDetailsUseCase: UpdateDeliveryDetailsUseCase,
    private readonly processRefundUseCase: ProcessRefundUseCase,
    private readonly exportOrdersToCSVUseCase: ExportOrdersToCSVUseCase,
    private readonly getCloudinarySignatureUseCase: GetCloudinarySignatureUseCase
  ) {}

  async getStats(req: Request, res: Response): Promise<void> {
    const stats = await this.getAdminStatsUseCase.execute();
    res.status(200).json({
      success: true,
      data: stats,
      message: "Admin statistics fetched"
    });
  }

  async getRevenueAnalytics(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = req.query;
    
    const filters = new RevenueFilters(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? (() => {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        return end;
      })() : undefined
    );

    const analytics = await this.getRevenueAnalyticsUseCase.execute(filters);
    res.status(200).json({
      success: true,
      data: analytics,
      message: "Revenue analytics fetched"
    });
  }

  async getDailyReport(req: Request, res: Response): Promise<void> {
    const { date } = req.query;
    const targetDate = date ? new Date(date as string) : new Date();

    const report = await this.getDailyReportUseCase.execute(targetDate);
    res.status(200).json({
      success: true,
      data: report,
      message: "Daily report fetched"
    });
  }

  async getMonthlyRevenue(req: Request, res: Response): Promise<void> {
    const { year } = req.query;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
      res.status(400).json({
        success: false,
        message: 'Invalid year provided'
      });
      return;
    }

    const revenue = await this.getMonthlyRevenueUseCase.execute(targetYear);
    res.status(200).json({
      success: true,
      data: revenue,
      message: "Monthly revenue fetched"
    });
  }

  async getYearlyRevenue(req: Request, res: Response): Promise<void> {
    const revenue = await this.getYearlyRevenueUseCase.execute();
    res.status(200).json({
      success: true,
      data: revenue,
      message: "Yearly revenue fetched"
    });
  }

  async getCloudinarySignature(req: Request, res: Response): Promise<void> {
    const { folder } = req.body;
    const signature = await this.getCloudinarySignatureUseCase.execute(folder);
    res.status(200).json(signature);
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    const { uid } = req.params;
    const adminId = req.admin?.id;

    if (!adminId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await this.blockUserUseCase.execute(uid, adminId);
    res.status(200).json({
      success: true,
      data: result,
      message: "User blocked successfully"
    });
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    const { uid } = req.params;
    const adminId = req.admin?.id;

    if (!adminId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await this.unblockUserUseCase.execute(uid, adminId);
    res.status(200).json({
      success: true,
      data: result,
      message: "User unblocked successfully"
    });
  }

  async getAuditLogs(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 12, filter, search } = req.query;

    const logs = await this.getAuditLogsUseCase.execute(
      Number(page),
      Number(limit),
      filter as string,
      search as string
    );

    res.status(200).json({
      success: true,
      data: logs,
      message: "Audit logs fetched"
    });
  }

  async sendResetLink(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const result = await this.sendPasswordResetLinkUseCase.execute(email);
    res.status(200).json({
      success: true,
      data: result,
      message: "Reset link sent successfully"
    });
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "Status is required" });
      return;
    }

    const validStatuses: OrderStatus[] = ["PENDING", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "FAILED"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const order = await this.updateOrderStatusUseCase.execute(orderId, status);
    res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully"
    });
  }

  async updateDeliveryDetails(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { partner, trackingId, estimatedDeliveryDate } = req.body;

    if (!partner || !trackingId) {
      res.status(400).json({ message: "Partner and tracking ID are required" });
      return;
    }

    const order = await this.updateDeliveryDetailsUseCase.execute(
      orderId,
      partner,
      trackingId,
      estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined
    );

    res.status(200).json({
      success: true,
      data: order,
      message: "Delivery details updated successfully"
    });
  }

  async processRefund(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    if (!reason) {
      res.status(400).json({ message: "Reason is required" });
      return;
    }

    const result = await this.processRefundUseCase.execute(orderId, amount, reason);
    res.status(200).json({
      success: true,
      data: result,
      message: "Refund processed successfully"
    });
  }

  async exportOrders(req: Request, res: Response): Promise<void> {
    const { status = "", paymentStatus = "", startDate = "", endDate = "" } = req.query;

    const filters = new RevenueFilters(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? (() => {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        return end;
      })() : undefined,
      status as string,
      paymentStatus as string
    );

    const csv = await this.exportOrdersToCSVUseCase.execute(filters);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=orders_${Date.now()}.csv`);
    res.status(200).send(csv);
  }
}