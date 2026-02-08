import { Router } from "express";
import { requireAdminAuth } from "../middlewares/admin.auth.middleware.js";

import adminAuthRoutes from "./auth.admin.routes.js";

import adminMainRoutes from "./admin.routes.js";
import userAdminRoutes from "./user.admin.routes.js";
import bookAdminRoutes from "./book.admin.routes.js";
import categoryAdminRoutes from "./category.admin.routes.js";
import authorAdminRoutes from "./author.admin.routes.js";
import bannerAdminRoutes from "./banner.admin.routes.js";
import orderAdminRoutes from "./order.admin.routes.js";

const router = Router();

router.use("/auth", adminAuthRoutes);

router.use(requireAdminAuth);

router.use("/", adminMainRoutes);
router.use("/users", userAdminRoutes);
router.use("/books", bookAdminRoutes);
router.use("/categories", categoryAdminRoutes);
router.use("/authors", authorAdminRoutes);
router.use("/banners", bannerAdminRoutes);
router.use("/orders", orderAdminRoutes);

export default router;