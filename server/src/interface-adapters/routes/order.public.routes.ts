import express, { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { requireUserAuth } from '../middlewares/user.auth.middleware.js';
import { OrderModule } from '../../infrastructure/di/OrderModule.js';

const router = Router();
const orderController = OrderModule.getOrderController();

router.get("/config/razorpay", ((req, res) => 
  orderController.getRazorpayConfig(req, res)
));

router.post("/webhook/razorpay", express.raw({ type: "application/json" }), 
  asyncHandler("Handle Razorpay Webhook")((req, res) => 
    orderController.handleWebhook(req, res)
  )
);

router.use(requireUserAuth);

router.post("/", asyncHandler("Create Order")((req, res) => 
  orderController.createOrder(req, res)
));

router.post("/verify-payment", asyncHandler("Verify Payment")((req, res) => 
  orderController.verifyPayment(req, res)
));

router.get("/my-orders", asyncHandler("Get Orders")((req, res) => 
  orderController.getOrders(req, res)
));

router.get("/:orderId", asyncHandler("Get Single Order Details By ID")((req, res) => 
  orderController.getOrderById(req, res)
));

router.patch("/:orderId/cancel", asyncHandler("Cancel Order")((req, res) => 
  orderController.cancelOrder(req, res)
));

export default router;