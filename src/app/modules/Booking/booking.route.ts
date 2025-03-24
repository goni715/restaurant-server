import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import BookingController from './booking.controller';
import { createBookingSchema } from './booking.validation';

const router = express.Router();

router.post(
  "/create-booking-without-payment",
  AuthMiddleware(UserRole.user),
  validationMiddleware(createBookingSchema),
  BookingController.createBookingWithoutPayment
);

router.post(
  "/create-booking-with-payment",
  AuthMiddleware(UserRole.user),
  validationMiddleware(createBookingSchema),
  BookingController.createBookingWithPayment
);



export const BookingRoutes = router;