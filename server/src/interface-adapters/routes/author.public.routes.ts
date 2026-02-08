import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AuthorModule } from "../../infrastructure/di/AuthorModule.js";

const router = Router();
const authorController = AuthorModule.getAuthorController();

router.get("/", asyncHandler("Get All Authors")((req, res) => 
  authorController.getAllAuthors(req, res)
));

router.get("/featured", asyncHandler("Get Featured Authors")((req, res) => 
  authorController.getFeaturedAuthors(req, res)
));

router.get("/:id", asyncHandler("Get Author Details")((req, res) => 
  authorController.getAuthorDetails(req, res)
));

export default router;