import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { UserModule } from '../../infrastructure/di/UserModule.js';
import { requireUserAuth } from '../middlewares/user.auth.middleware.js';

const router = Router();
const userController = UserModule.getUserController();

router.use(requireUserAuth);

router.get('/me', asyncHandler("Get Current User")((req, res) => 
  userController.getUser(req, res)
));

router.patch('/edit-user/:userId', asyncHandler("Update User")((req, res) => 
  userController.updateUser(req, res)
));

router.get('/wishlist/:userId', asyncHandler("Get Wishlist")((req, res) => 
  userController.getWishlist(req, res)
));

router.post('/wishlist/:userId/:bookId', asyncHandler("Add To Wishlist")((req, res) => 
  userController.addToWishlist(req, res)
));

router.delete('/wishlist/:userId/:bookId', asyncHandler("Remove From Wishlist")((req, res) => 
  userController.removeFromWishlist(req, res)
));

// Cloudinary endpoints
router.post("/cloudinary-signature", asyncHandler("Get Cloudinary Signature")((req, res) => 
  userController.getCloudinarySignature(req, res)
));

export default router;