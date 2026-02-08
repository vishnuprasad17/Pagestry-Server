import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireUserAuth } from "../middlewares/user.auth.middleware.js";
import { CartModule } from "../../infrastructure/di/CartModule.js";

const router = Router();
const cartController = CartModule.getCartController();

router.get(
  "/:userId", 
  requireUserAuth, 
  asyncHandler("Get Cart")((req, res) => cartController.getCart(req, res))
);

router.patch(
  "/update/:userId", 
  requireUserAuth, 
  asyncHandler("Update Cart")((req, res) => cartController.updateCartItem(req, res))
);

router.delete(
  "/update/:userId/:bookId", 
  requireUserAuth, 
  asyncHandler("Remove Cart Item")((req, res) => cartController.removeCartItem(req, res))
);

router.post(
  "/merge/:userId", 
  requireUserAuth, 
  asyncHandler("Merge Cart")((req, res) => cartController.mergeCart(req, res))
);

router.post(
  "/validate", 
  requireUserAuth, 
  asyncHandler("Validate Cart Stock")((req, res) => cartController.validateCartStock(req, res))
);

router.delete(
  "/clear/:userId", 
  requireUserAuth, 
  asyncHandler("Clear Cart")((req, res) => cartController.clearCart(req, res))
);

export default router;