import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { AdminModule } from '../../infrastructure/di/AdminModule.js';

const router = Router();
const adminController = AdminModule.getAdminController();

// Dashboard statistics
router.get('/stats', asyncHandler("Get Stats")((req, res) => 
  adminController.getStats(req, res)
));

router.get("/analytics/revenue", asyncHandler("Get Analytics Revenue")((req, res) => 
  adminController.getRevenueAnalytics(req, res)
));

// Report endpoints
router.get("/report/daily", asyncHandler("Get Daily Report")((req, res) => 
  adminController.getDailyReport(req, res)
));

router.get("/export", asyncHandler("Export Orders")((req, res) => 
  adminController.exportOrders(req, res)
));

// Revenue endpoints
router.get('/revenue/monthly', asyncHandler("Get Monthly Revenue")((req, res) => 
  adminController.getMonthlyRevenue(req, res)
));

router.get('/revenue/yearly', asyncHandler("Get Yearly Revenue")((req, res) => 
  adminController.getYearlyRevenue(req, res)
));

// Update order status
router.patch("/status/:orderId", asyncHandler("Update Order Status")((req, res) => 
  adminController.updateOrderStatus(req, res)
));

// Update delivery details
router.patch("/delivery/:orderId", asyncHandler("Update Delivery Details")((req, res) => 
  adminController.updateDeliveryDetails(req, res)
));

router.post("/refund/:orderId", asyncHandler("Process Refund")((req, res) => 
  adminController.processRefund(req, res)
));

// Cloudinary endpoints
router.post("/cloudinary-signature", asyncHandler("Get Cloudinary Signature")((req, res) => 
  adminController.getCloudinarySignature(req, res)
));

// Block - Unblock User
router.patch("/:uid/block", asyncHandler("Block User")((req, res) => 
  adminController.blockUser(req, res)
));

router.patch("/:uid/unblock", asyncHandler("Unblock User")((req, res) => 
  adminController.unblockUser(req, res)
));

// Audit Logs
router.get("/audit-logs", asyncHandler("Get Audit Logs")((req, res) => 
  adminController.getAuditLogs(req, res)
));

export default router;