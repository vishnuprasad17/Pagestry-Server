import { Router } from 'express';
import authRoutes from './auth.public.routes.js';
import adminRoutes from './index.admin.routes.js';
import bookRoutes from './book.public.routes.js';
import orderRoutes from './order.public.routes.js';
import userRoutes from './user.public.routes.js';
import reviewRoutes from './review.routes.js';
import categoryRoutes from './category.public.routes.js';
import cartRoutes from './cart.routes.js';
import authorRoutes from './author.public.routes.js';
import bannerRoutes from './banner.public.routes.js';
import addressRoutes from './address.public.routes.js';

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/books", bookRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/authors", authorRoutes);
router.use("/banners", bannerRoutes);
router.use("/addresses", addressRoutes);

export default router;