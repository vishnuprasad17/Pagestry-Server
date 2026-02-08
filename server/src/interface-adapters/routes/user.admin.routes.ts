import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { UserModule } from "../../infrastructure/di/UserModule.js";

const router = Router();
const userController = UserModule.getUserController();

router.get("/", asyncHandler("Get All Users")((req, res) => 
  userController.getUsers(req, res)
));

export default router;