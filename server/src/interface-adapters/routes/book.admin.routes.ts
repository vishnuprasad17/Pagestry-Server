import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { BookModule } from "../../infrastructure/di/BookModule.js";

const router = Router();
const bookController = BookModule.getBookController();

router.get("/", asyncHandler("Get All Books")((req, res) => 
  bookController.getFilteredBooks(req, res)
));

router.get("/book/:id", asyncHandler("Get Single Book")((req, res) => 
  bookController.getSingleBook(req, res)
));

router.post("/add-book", asyncHandler("Add Book")((req, res) => 
  bookController.addBook(req, res)
));

router.put("/edit-book/:id", asyncHandler("Update Book")((req, res) => 
  bookController.updateBook(req, res)
));

router.delete("/delete-book/:id", asyncHandler("Delete Book")((req, res) => 
  bookController.deleteBook(req, res)
));

export default router;