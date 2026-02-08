import { IBannerRepository } from "../../application/ports/IBannerRepository.js";
import { IImageStorageService } from "../../application/ports/IImageStorageService.js";
import { CreateBannerUseCase } from "../../application/use-cases/CreateBannerUseCase.js";
import { DeleteBannerUseCase } from "../../application/use-cases/DeleteBannerUseCase.js";
import { GetActiveBannersUseCase } from "../../application/use-cases/GetActiveBannersUseCase.js";
import { GetBannerByIdUseCase } from "../../application/use-cases/GetBannerByIdUseCase.js";
import { GetFilteredBannersUseCase } from "../../application/use-cases/GetFilteredBannersUseCase.js";
import { UpdateBannerStatusUseCase } from "../../application/use-cases/UpdateBannerStatusUseCase.js";
import { UpdateBannerUseCase } from "../../application/use-cases/UpdateBannerUseCase.js";
import { BannerController } from "../../interface-adapters/controllers/BannerController.js";
import { BannerModel } from "../persistence/mongoose/models/BannerModel.js";
import { MongoBannerRepository } from "../persistence/mongoose/repositories/MongoBannerRepository.js";
import { CloudinaryImageStorage } from "../services/CloudinaryImageStorage.js";

export class BannerModule {
  private static bannerRepository: IBannerRepository;
  private static imageStorage: IImageStorageService;

  static getBannerRepository(): IBannerRepository {
    if (!this.bannerRepository) {
      this.bannerRepository = new MongoBannerRepository(BannerModel);
    }
    return this.bannerRepository;
  }

  static getImageStorage(): IImageStorageService {
    if (!this.imageStorage) {
      this.imageStorage = new CloudinaryImageStorage();
    }
    return this.imageStorage;
  }

  static getCreateBannerUseCase(): CreateBannerUseCase {
    return new CreateBannerUseCase(this.getBannerRepository());
  }

  static getGetFilteredBannersUseCase(): GetFilteredBannersUseCase {
    return new GetFilteredBannersUseCase(this.getBannerRepository());
  }

  static getGetActiveBannersUseCase(): GetActiveBannersUseCase {
    return new GetActiveBannersUseCase(this.getBannerRepository());
  }

  static getGetBannerByIdUseCase(): GetBannerByIdUseCase {
    return new GetBannerByIdUseCase(this.getBannerRepository());
  }

  static getUpdateBannerUseCase(): UpdateBannerUseCase {
    return new UpdateBannerUseCase(
      this.getBannerRepository(),
      this.getImageStorage()
    );
  }

  static getUpdateBannerStatusUseCase(): UpdateBannerStatusUseCase {
    return new UpdateBannerStatusUseCase(this.getBannerRepository());
  }

  static getDeleteBannerUseCase(): DeleteBannerUseCase {
    return new DeleteBannerUseCase(
      this.getBannerRepository(),
      this.getImageStorage()
    );
  }

  static getBannerController(): BannerController {
    return new BannerController(
      this.getCreateBannerUseCase(),
      this.getGetFilteredBannersUseCase(),
      this.getGetActiveBannersUseCase(),
      this.getGetBannerByIdUseCase(),
      this.getUpdateBannerUseCase(),
      this.getUpdateBannerStatusUseCase(),
      this.getDeleteBannerUseCase()
    );
  }
}