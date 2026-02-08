import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { CategoryModule } from "../../infrastructure/di/CategoryModule.js";

const router = Router();
const categoryController = CategoryModule.getCategoryController();

router.get("/", asyncHandler("Get All Categories")((req, res) => 
    categoryController.getCategories(req, res)
));

router.post("/add-category", asyncHandler("Create Category")((req, res) => 
    categoryController.createCategory(req, res)
));

router.put("/edit-category/:id", asyncHandler("Update Category")((req, res) => 
    categoryController.updateCategory(req, res)
));

router.delete("/delete-category/:id", asyncHandler("Delete Category")((req, res) => 
    categoryController.deleteCategory(req, res)
));

export default router;