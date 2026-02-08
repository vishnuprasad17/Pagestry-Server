import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { BannerModule } from "../../infrastructure/di/BannerModule.js";

const router = Router();
const bannerController = BannerModule.getBannerController();

router.get("/", asyncHandler("Get Filtered Banners")((req, res) => 
  bannerController.getFilteredBanners(req, res)
));

router.get("/:id", asyncHandler("Get Single Banner")((req, res) => 
  bannerController.getSingleBanner(req, res)
));

router.post("/add-banner", asyncHandler("Create Banner")((req, res) => 
  bannerController.createBanner(req, res)
));

router.put("/edit-banner/:id", asyncHandler("Update Banner")((req, res) => 
  bannerController.updateBanner(req, res)
));

router.put("/update-banner-status/:id", asyncHandler("Update Banner Status")((req, res) => 
  bannerController.updateBannerStatus(req, res)
));

router.delete("/delete-banner/:id", asyncHandler("Delete Banner")((req, res) => 
  bannerController.deleteBanner(req, res)
));

export default router;