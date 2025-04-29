import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import validationMiddleware from "../../middlewares/validationMiddleware";
import TableBookingController from "./tableBooking.controller";
import { createTableBookingSchema } from "./tableBooking.validation";

const router = express.Router();

router.post(
  "/create-table-booking",
  AuthMiddleware(UserRole.owner),
 // validationMiddleware(createTableBookingSchema),
  TableBookingController.createTableBooking
);



export const TableBookingRoutes = router;
