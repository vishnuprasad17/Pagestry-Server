export interface IPaymentService {
  createRazorpayOrder(data: CreateRazorpayOrderData): Promise<CreateRazorpayOrderResult>;
  verifyPaymentSignature(data: VerifySignatureData): boolean;
  verifyWebhookSignature(payload: string, signature: string): boolean;
  initiateRefund(paymentId: string, amount?: number): Promise<RefundResult>;
}

export interface CreateRazorpayOrderData {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
}

export interface CreateRazorpayOrderResult {
  success: boolean;
  orderId?: string;
  message?: string;
}

export interface VerifySignatureData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  amount?: number;
  message?: string;
}