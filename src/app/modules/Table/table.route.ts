import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import validationMiddleware from "../../middlewares/validationMiddleware";
import TableController from "./table.controller";
import { createTableValidationSchema } from "./table.validation";

const router = express.Router();

router.post(
  "/create-table",
  AuthMiddleware(UserRole.admin),
  validationMiddleware(createTableValidationSchema),
  TableController.createTable
);

router.get(
  "/get-tables/:scheduleId/:diningId",
  AuthMiddleware(UserRole.admin),
  TableController.getTables
);

export const TableRoutes = router;
