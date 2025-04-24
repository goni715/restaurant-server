import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import MenuReviewController from './menuReview.controller';
import { createMenuReviewValidationSchema } from './menuReview.validation';

const router = express.Router();

router.post(
  "/create-menu-review",
  AuthMiddleware(UserRole.user),
  validationMiddleware(createMenuReviewValidationSchema),
  MenuReviewController.createMenuReview
);
router.delete(
  "/delete-menu-review/:reviewId",
  AuthMiddleware(UserRole.owner),
  MenuReviewController.deleteMenuReview
);
router.get(
  "/get-menu-reviews/:menuId",
  AuthMiddleware(UserRole.owner),
  MenuReviewController.getMenuReviews
);

export const MenuReviewRoutes = router;