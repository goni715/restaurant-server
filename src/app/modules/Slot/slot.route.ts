import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import SlotController from "./slot.controller";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { createSlotSchema } from "./slot.validation";

const router = express.Router();

router.post(
  "/create-slot",
  AuthMiddleware(UserRole.owner),
  validationMiddleware(createSlotSchema),
  SlotController.createSlot
);

router.get(
  "/get-slots",
  AuthMiddleware(UserRole.owner),
  SlotController.getSlots
);


router.get(
  "/get-slot-drop-down",
  AuthMiddleware(UserRole.owner),
  SlotController.getSlotDropDown
);

router.delete(
  "/delete-slot/:slotId",
  AuthMiddleware(UserRole.owner),
  SlotController.deleteSlot
);

export const SlotRoutes = router;
