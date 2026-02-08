import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AuthorModule } from "../../infrastructure/di/AuthorModule.js";

const router = Router();
const authorController = AuthorModule.getAuthorController();

router.get("/", asyncHandler("Get All Authors")((req, res) => 
  authorController.getAllAuthors(req, res)
));

router.get("/filtered", asyncHandler("Get Filtered Authors")((req, res) => 
  authorController.getFilteredAuthors(req, res)
));

router.get("/:id", asyncHandler("Get Single Author")((req, res) => 
  authorController.getSingleAuthor(req, res)
));

router.post("/add-author", asyncHandler("Create Author")((req, res) => 
  authorController.createAuthor(req, res)
));

router.put("/edit-author/:id", asyncHandler("Update Author")((req, res) => 
  authorController.updateAuthor(req, res)
));

router.delete("/delete-author/:id", asyncHandler("Delete Author")((req, res) => 
  authorController.deleteAuthor(req, res)
));

export default router;