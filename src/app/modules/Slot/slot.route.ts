import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import SlotController from "./slot.controller";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { createSlotSchema } from "./slot.validation";

const router = express.Router();

router.post(
  "/create-slot",
  AuthMiddleware(UserRole.admin),
  validationMiddleware(createSlotSchema),
  SlotController.createSlot
);

router.get(
  "/get-slots",
  AuthMiddleware(UserRole.admin),
  SlotController.getSlots
);


router.get(
  "/get-slot-drop-down",
  AuthMiddleware(UserRole.admin),
  SlotController.getSlotDropDown
);

export const SlotRoutes = router;
