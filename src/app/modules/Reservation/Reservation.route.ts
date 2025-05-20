import express from "express";
import ReservationController from "./Reservation.controller";
import validationMiddleware from "../../middlewares/validationMiddleware";
import {
  createReservationValidationSchema,
  updateReservationValidationSchema,
} from "./Reservation.validation";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";

const router = express.Router();

router.post(
  "/create-reservation",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(createReservationValidationSchema),
  ReservationController.createReservation
);

router.patch(
  "/update-reservation/:reservationId",
  AuthMiddleware("owner"),
  validationMiddleware(updateReservationValidationSchema),
  ReservationController.updateReservation
);

router.delete(
  "/delete-reservation/:reservationId",
  AuthMiddleware("owner"),
  ReservationController.deleteReservation
);

router.get(
  "/get-reservations",
  AuthMiddleware(UserRole.owner),
  ReservationController.getReservations
);

router.get(
  "/get-reservations-by-scheduleId-and-diningId/:scheduleId/:diningId",
  AuthMiddleware(UserRole.owner),
  ReservationController.getReservationsByScheduleIdAndDiningId
);

router.get(
  "/get-user-reservations-by-date/:restaurantId/:date",
  AuthMiddleware(UserRole.user),
  ReservationController.getUserReservationsByDate
);

router.get(
  "/get-dinings-by-restaurantId-and-scheduleId/:restaurantId/:scheduleId",
  AuthMiddleware(UserRole.user),
  ReservationController.getDiningsByRestaurantIdAndScheduleId
);

router.get(
  "/get-seats-by-diningId/:diningId",
  AuthMiddleware(UserRole.user),
  ReservationController.getSeatsByDiningId
);

const ReservationRoutes = router;
export default ReservationRoutes;
