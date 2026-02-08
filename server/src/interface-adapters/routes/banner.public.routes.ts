import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { BannerModule } from "../../infrastructure/di/BannerModule.js";

const router = Router();
const bannerController = BannerModule.getBannerController();

router.get("/", asyncHandler("Get Active Banners")((req, res) => 
  bannerController.getActiveBanners(req, res)
));

export default router;