import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { OrderModule } from "../../infrastructure/di/OrderModule.js";

const router = Router();
const orderController = OrderModule.getOrderController();

router.get("/", asyncHandler("Get Filtered Orders")((req, res) => 
  orderController.getFilteredOrdersForAdmin(req, res)
));

router.get("/:orderId", asyncHandler("Get Single Order")((req, res) => 
  orderController.getOrderById(req, res)
));

export default router;