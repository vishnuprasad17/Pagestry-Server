import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { BookModule } from '../../infrastructure/di/BookModule.js';

const router = Router();
const bookController = BookModule.getBookController();

router.get("/", asyncHandler("Get All Books")((req, res) => 
  bookController.getAllBooks(req, res)
));

router.get("/get-books", asyncHandler("Get Filtered Books")((req, res) => 
  bookController.getFilteredBooks(req, res)
));

router.get("/search", asyncHandler("Get Suggestions")((req, res) => 
  bookController.getSuggestions(req, res)
));

router.get("/featured", asyncHandler("Get Featured Books")((req, res) => 
  bookController.getFeaturedBooks(req, res)
));

router.get("/trending", asyncHandler("Get Trending Books")((req, res) => 
  bookController.getTrendingBooks(req, res)
));

router.get("/:id", asyncHandler("Get Single Book")((req, res) => 
  bookController.getSingleBook(req, res)
));

export default router;