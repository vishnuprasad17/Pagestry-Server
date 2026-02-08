import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireUserAuth } from "../middlewares/user.auth.middleware.js";
import { ReviewModule } from "../../infrastructure/di/ReviewModule.js";

const router = Router();
const reviewController = ReviewModule.getReviewController();

router.get("/:bookId", asyncHandler("Get Book Reviews")((req, res) => 
  reviewController.getBookReviews(req, res)
));

router.get("/user/:userId/book/:bookId", asyncHandler("Get User Review For Book")((req, res) => 
  reviewController.getUserReviewForBook(req, res)
));

router.use(requireUserAuth);

router.post("/add-review", asyncHandler("Create Review")((req, res) => 
  reviewController.createReview(req, res)
));

router.put("/like/:userId/:reviewId", asyncHandler("Like Review")((req, res) => 
  reviewController.likeReview(req, res)
));

router.put("/dislike/:userId/:reviewId", asyncHandler("Dislike Review")((req, res) => 
  reviewController.dislikeReview(req, res)
));

router.put("/edit/:id", asyncHandler("Update Review")((req, res) => 
  reviewController.updateReview(req, res)
));

router.delete("/delete/:id", asyncHandler("Delete Review")((req, res) => 
  reviewController.deleteReview(req, res)
));

export default router;