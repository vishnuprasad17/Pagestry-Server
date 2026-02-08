import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AuthModule } from "../../infrastructure/di/AuthModule.js";

const router = Router();
const authController = AuthModule.getAuthController();

router.post("/sync-user", asyncHandler("Sync User")((req, res) => 
  authController.syncUser(req, res)
));

router.post('/user/logout', asyncHandler("User Logout")((req, res) => 
  authController.logout(req, res)
));

export default router;