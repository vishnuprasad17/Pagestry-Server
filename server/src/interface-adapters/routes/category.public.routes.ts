import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { CategoryModule } from "../../infrastructure/di/CategoryModule.js";

const router = Router();
const categoryController = CategoryModule.getCategoryController();

router.get("/", asyncHandler("Get All Categories")((req, res) => 
    categoryController.getCategories(req, res)
));

export default router;