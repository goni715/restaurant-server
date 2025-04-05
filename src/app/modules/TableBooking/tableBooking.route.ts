import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import validationMiddleware from "../../middlewares/validationMiddleware";
import TableBookingController from "./tableBooking.controller";

const router = express.Router();

router.post(
  "/create-table-booking",
  AuthMiddleware(UserRole.admin),
  TableBookingController.createTableBooking
);



export const TableBookingRoutes = router;
