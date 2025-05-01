import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import BookingController from './booking.controller';
import { createBookingWithoutPaymentSchema, createBookingWithPaymentSchema } from './booking.validation';

const router = express.Router();

router.post(
  "/create-booking-without-payment",
  AuthMiddleware(UserRole.user),
  validationMiddleware(createBookingWithoutPaymentSchema),
  BookingController.createBookingWithoutPayment
);

router.post(
  "/create-booking-with-payment",
  AuthMiddleware(UserRole.user),
  validationMiddleware(createBookingWithPaymentSchema),
  BookingController.createBookingWithPayment
);

router.get(
  "/get-bookings",
  AuthMiddleware(UserRole.owner),
  BookingController.getBookings
);

router.get(
  "/get-my-bookings",
  AuthMiddleware(UserRole.user),
  BookingController.getMyBookings
);
export const BookingRoutes = router;