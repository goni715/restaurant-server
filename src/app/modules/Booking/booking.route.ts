import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import BookingController from './booking.controller';

const router = express.Router();

router.post(
  "/create-booking",
  AuthMiddleware(UserRole.user),
  BookingController.createBooking
);



export const BookingRoutes = router;