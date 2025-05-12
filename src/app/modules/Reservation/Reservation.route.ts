import express from 'express';
import ReservationController from './Reservation.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createReservationValidationSchema, updateReservationValidationSchema } from './Reservation.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-reservation',
  AuthMiddleware(UserRole.owner),
  validationMiddleware(createReservationValidationSchema),
  ReservationController.createReservation,
);

router.get(
  '/get-single-reservation/:reservationId',
  ReservationController.getSingleReservation,
);

router.patch(
  '/update-reservation/:reservationId',
  validationMiddleware(updateReservationValidationSchema),
  ReservationController.updateReservation,
);

router.delete(
  '/delete-reservation/:reservationId',
  ReservationController.deleteReservation,
);

router.get(
  '/get-reservations',
   AuthMiddleware(UserRole.owner),
  ReservationController.getReservations,
);

router.get(
  '/get-reservations-by-date/:date',
   AuthMiddleware(UserRole.owner),
  ReservationController.getReservationsByDate,
);

router.get(
  '/get-user-reservations-by-date/:restaurantId/:date',
   AuthMiddleware(UserRole.user),
  ReservationController.getUserReservationsByDate,
);
const ReservationRoutes = router;
export default ReservationRoutes;
