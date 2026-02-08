import { Request, Response } from "express";
import { CreateReviewUseCase } from "../../application/use-cases/CreateReviewUseCase.js";
import { GetBookReviewsUseCase } from "../../application/use-cases/GetBookReviewsUseCase.js";
import { GetUserReviewForBookUseCase } from "../../application/use-cases/GetUserReviewForBookUseCase.js";
import { LikeReviewUseCase } from "../../application/use-cases/LikeReviewUseCase.js";
import { DislikeReviewUseCase } from "../../application/use-cases/DislikeReviewUseCase.js";
import { UpdateReviewUseCase } from "../../application/use-cases/UpdateReviewUseCase.js";
import { DeleteReviewUseCase } from "../../application/use-cases/DeleteReviewUseCase.js";
import { CreateReviewDto, UpdateReviewDto } from "../../application/dto/ReviewDto.js";

export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getBookReviewsUseCase: GetBookReviewsUseCase,
    private readonly getUserReviewForBookUseCase: GetUserReviewForBookUseCase,
    private readonly likeReviewUseCase: LikeReviewUseCase,
    private readonly dislikeReviewUseCase: DislikeReviewUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase
  ) {}

  async createReview(req: Request, res: Response): Promise<void> {
    const dto: CreateReviewDto = req.body;

    const review = await this.createReviewUseCase.execute(dto);
    res.status(201).json({
      success: true,
      data: review,
      message: "Review created successfully"
    });
  }

  async getBookReviews(req: Request, res: Response): Promise<void> {
    const { bookId } = req.params;
    const page = Number(req.query.page) || 1;
    const currentUserId = req.user?.uid;

    const result = await this.getBookReviewsUseCase.execute(bookId, page, currentUserId);
    res.status(200).json({
      success: true,
      data: result,
      message: "Reviews fetched successfully"
    });
  }

  async getUserReviewForBook(req: Request, res: Response): Promise<void> {
    const { userId, bookId } = req.params;

    const review = await this.getUserReviewForBookUseCase.execute(userId, bookId);
    res.status(200).json({
      success: true,
      data: review,
      message: "Review fetched successfully"
    });
  }

  async likeReview(req: Request, res: Response): Promise<void> {
    const { userId, reviewId } = req.params;

    const review = await this.likeReviewUseCase.execute(userId, reviewId);
    res.status(200).json({
      success: true,
      data: review,
      message: "Review liked successfully"
    });
  }

  async dislikeReview(req: Request, res: Response): Promise<void> {
    const { userId, reviewId } = req.params;

    const review = await this.dislikeReviewUseCase.execute(userId, reviewId);
    res.status(200).json({
      success: true,
      data: review,
      message: "Review disliked successfully"
    });
  }

  async updateReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto: UpdateReviewDto = req.body;
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const review = await this.updateReviewUseCase.execute(id, uid, dto);
    res.status(200).json({
      success: true,
      data: review,
      message: "Review updated successfully"
    });
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await this.deleteReviewUseCase.execute(id, uid);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Review deleted successfully"
    });
  }
}