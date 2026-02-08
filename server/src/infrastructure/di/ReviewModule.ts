import { IReviewRepository } from "../../application/ports/IReviewRepository.js";
import { IReviewUnitOfWork } from "../../application/ports/IUnitOfWork.js";
import { CreateReviewUseCase } from "../../application/use-cases/CreateReviewUseCase.js";
import { DeleteReviewUseCase } from "../../application/use-cases/DeleteReviewUseCase.js";
import { DislikeReviewUseCase } from "../../application/use-cases/DislikeReviewUseCase.js";
import { GetBookReviewsUseCase } from "../../application/use-cases/GetBookReviewsUseCase.js";
import { GetUserReviewForBookUseCase } from "../../application/use-cases/GetUserReviewForBookUseCase.js";
import { LikeReviewUseCase } from "../../application/use-cases/LikeReviewUseCase.js";
import { UpdateReviewUseCase } from "../../application/use-cases/UpdateReviewUseCase.js";
import { ReviewController } from "../../interface-adapters/controllers/ReviewController.js";
import { ReviewModel } from "../persistence/mongoose/models/ReviewModel.js";
import { MongoReviewUnitOfWork } from "../persistence/mongoose/MongoReviewUnitOfWork.js";
import { MongoReviewRepository } from "../persistence/mongoose/repositories/MongoReviewRepository.js";

export class ReviewModule {
  private static reviewRepository: IReviewRepository;
  private static unitOfWork: IReviewUnitOfWork;

  static getReviewRepository(): IReviewRepository {
    if (!this.reviewRepository) {
      this.reviewRepository = new MongoReviewRepository(ReviewModel);
    }
    return this.reviewRepository;
  }

  static getUnitOfWork(): IReviewUnitOfWork {
    return new MongoReviewUnitOfWork();
  }

  static getCreateReviewUseCase(): CreateReviewUseCase {
    return new CreateReviewUseCase(this.getUnitOfWork());
  }

  static getGetBookReviewsUseCase(): GetBookReviewsUseCase {
    return new GetBookReviewsUseCase(this.getReviewRepository());
  }

  static getGetUserReviewForBookUseCase(): GetUserReviewForBookUseCase {
    return new GetUserReviewForBookUseCase(this.getReviewRepository());
  }

  static getLikeReviewUseCase(): LikeReviewUseCase {
    return new LikeReviewUseCase(this.getReviewRepository());
  }

  static getDislikeReviewUseCase(): DislikeReviewUseCase {
    return new DislikeReviewUseCase(this.getReviewRepository());
  }

  static getUpdateReviewUseCase(): UpdateReviewUseCase {
    return new UpdateReviewUseCase(this.getUnitOfWork());
  }

  static getDeleteReviewUseCase(): DeleteReviewUseCase {
    return new DeleteReviewUseCase(this.getUnitOfWork());
  }

  static getReviewController(): ReviewController {
    return new ReviewController(
      this.getCreateReviewUseCase(),
      this.getGetBookReviewsUseCase(),
      this.getGetUserReviewForBookUseCase(),
      this.getLikeReviewUseCase(),
      this.getDislikeReviewUseCase(),
      this.getUpdateReviewUseCase(),
      this.getDeleteReviewUseCase()
    );
  }
}