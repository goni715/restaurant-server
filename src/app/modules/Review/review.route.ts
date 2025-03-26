import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import ReviewController from './review.controller';
import { createReviewValidationSchema } from './review.validation';

const router = express.Router();

router.post('/create-review', AuthMiddleware(UserRole.user), validationMiddleware(createReviewValidationSchema), ReviewController.createReview);
router.delete('/delete-review/:reviewId', AuthMiddleware(UserRole.super_admin), ReviewController.deleteReview)
router.get('/get-my-restaurant-reviews', AuthMiddleware(UserRole.admin), ReviewController.getMyRestaurantReviews);
router.get('/get-restaurant-reviews/:restaurantId', AuthMiddleware(UserRole.super_admin, UserRole.admin, UserRole.user), ReviewController.getRestaurantReviews);


export const ReviewRoutes = router;