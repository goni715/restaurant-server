import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import ReviewController from './review.controller';
import { createReviewValidationSchema } from './review.validation';

const router = express.Router();

router.post('/create-review', AuthMiddleware(UserRole.user), validationMiddleware(createReviewValidationSchema), ReviewController.createReview);


export const ReviewRoutes = router;