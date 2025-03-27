import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import SlotController from "./slot.controller";

const router = express.Router();

router.post(
  "/create-slot",
  AuthMiddleware(UserRole.admin),
  SlotController.createSlot
);

export const SlotRoutes = router;
