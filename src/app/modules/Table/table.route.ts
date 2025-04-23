import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import validationMiddleware from "../../middlewares/validationMiddleware";
import TableController from "./table.controller";
import { createTableValidationSchema } from "./table.validation";

const router = express.Router();

router.post(
  "/create-table",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(createTableValidationSchema),
  TableController.createTable
);

router.get(
  "/get-tables",
  AuthMiddleware(UserRole.owner),
  TableController.getTables
);

router.get(
  "/get-tables-by-schedule-and-dining/:scheduleId/:diningId",
  AuthMiddleware(UserRole.owner),
  TableController.getTablesByScheduleAndDining
);

export const TableRoutes = router;
