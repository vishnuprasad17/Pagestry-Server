import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AuthModule } from "../../infrastructure/di/AuthModule.js";

const router = Router();
const authController = AuthModule.getAuthController();

router.post("/login", asyncHandler("Admin Login")((req, res) => 
  authController.adminLogin(req, res)
));

router.post('/logout', asyncHandler("Admin Logout")((req, res) => 
  authController.logout(req, res)
));

export default router;