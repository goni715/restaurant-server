import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import validationMiddleware from "../../middlewares/validationMiddleware";
import TableController from "./table.controller";

const router = express.Router();

router.post(
  "/create-new-table",
  AuthMiddleware(UserRole.admin),
  TableController.createTable
);


export const TableRoutes = router;
