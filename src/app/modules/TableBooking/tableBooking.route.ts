import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import validationMiddleware from "../../middlewares/validationMiddleware";
import TableBookingController from "./tableBooking.controller";
import { changeAvailibilitySchema, createTableBookingSchema } from "./tableBooking.validation";

const router = express.Router();

router.post(
  "/create-table-booking",
  AuthMiddleware(UserRole.owner),
 validationMiddleware(createTableBookingSchema),
  TableBookingController.createTableBooking
);
router.get(
  "/get-table-bookings",
  AuthMiddleware(UserRole.owner),
  TableBookingController.getTableBookings
);
router.patch(
  "/change-availability/:tableBookingId",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(changeAvailibilitySchema),
  TableBookingController.changeAvailability
);
router.delete(
  "/delete-table-booking/:tableBookingId",
  AuthMiddleware(UserRole.owner),
  TableBookingController.deleteTableBooking
);


export const TableBookingRoutes = router;
