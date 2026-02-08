import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/use-cases/CreateOrderUseCase.js";
import { VerifyPaymentUseCase } from "../../application/use-cases/VerifyPaymentUseCase.js";
import { GetOrdersUseCase } from "../../application/use-cases/GetOrdersUseCase.js";
import { GetFilteredOrdersUseCase } from "../../application/use-cases/GetFilteredOrdersUseCase.js";
import { GetOrderByIdUseCase } from "../../application/use-cases/GetOrderByIdUseCase.js";
import { CancelOrderUseCase } from "../../application/use-cases/CancelOrderUseCase.js";
import { HandleWebhookUseCase } from "../../application/use-cases/HandleWebhookUseCase.js";

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getFilteredOrdersUseCase: GetFilteredOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly handleWebhookUseCase: HandleWebhookUseCase
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    const { idempotencyKey, userId, email, addressId, items, subtotal, deliveryCharge, totalPrice, paymentMethod } = req.body;
    const userEmail = req.user?.email as string;

    if (email !== userEmail) {
      res.status(403).json({ message: "You are not authorized to create an order for this email" });
      return;
    }

    if (!idempotencyKey || !addressId || !items || !subtotal || deliveryCharge === undefined || deliveryCharge === null || !totalPrice || !paymentMethod) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!["RAZORPAY", "COD"].includes(paymentMethod)) {
      res.status(400).json({ message: "Invalid payment method" });
      return;
    }

    const result = await this.createOrderUseCase.execute({
      idempotencyKey,
      userId,
      email,
      addressId,
      items,
      subtotal,
      deliveryCharge,
      totalPrice,
      paymentMethod
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const result = await this.verifyPaymentUseCase.execute({
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).json(result);
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers["x-razorpay-signature"] as string;
    const rawBody = JSON.stringify(req.body);

    if (!signature) {
      res.status(400).json({ message: "Missing signature header" });
      return;
    }

    const result = await this.handleWebhookUseCase.execute(req.body, signature, rawBody);
    res.status(200).json(result);
  }

  async getOrders(req: Request, res: Response): Promise<void> {
    const email = req.user?.email as string;
    const { page = 1, limit = 5 } = req.query;

    const result = await this.getOrdersUseCase.execute(email, Number(page), Number(limit));
    res.status(200).json({
      success: true,
      data: result,
      message: "Orders fetched successfully"
    });
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;

    const order = await this.getOrderByIdUseCase.execute(orderId);
    res.status(200).json({
      success: true,
      data: order,
      message: "Order fetched successfully"
    });
  }

  async cancelOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { reason } = req.body;
    const uid = req.user?.uid as string;

    const result = await this.cancelOrderUseCase.execute(orderId, uid, reason);
    res.status(200).json(result);
  }

  async getFilteredOrdersForAdmin(req: Request, res: Response): Promise<void> {
    const {
      page = "1",
      limit = "20",
      search = "",
      status = "",
      paymentStatus = "",
      paymentMethod = "",
      startDate = "",
      endDate = ""
    } = req.query;

    let start: Date | undefined;
    let end: Date | undefined;

    if (startDate) start = new Date(startDate as string);
    if (endDate) {
      end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
    }

    const result = await this.getFilteredOrdersUseCase.execute(
      status as string,
      paymentStatus as string,
      paymentMethod as string,
      start,
      end,
      search as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Orders fetched successfully"
    });
  }

  getRazorpayConfig(req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      data: { keyId: process.env.RAZORPAY_KEY_ID },
      message: "Razorpay config fetched successfully"
    });
  }
}