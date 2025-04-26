import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import validationMiddleware from "../../middlewares/validationMiddleware";
import TableController from "./table.controller";
import { createTableValidationSchema, updateTableValidationSchema } from "./table.validation";

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

router.delete(
  "/delete-table/:tableId",
  AuthMiddleware(UserRole.owner),
  TableController.deleteTable
);

router.patch(
  "/update-table/:tableId",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(updateTableValidationSchema),
  TableController.updateTable
);

export const TableRoutes = router;
