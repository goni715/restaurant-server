import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import NotificationController from "./notification.controller";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { createNotificationValidationSchema } from "./notification.validation";

const router = express.Router();

router.post(
  "/create-notification",
  AuthMiddleware(UserRole.admin, UserRole.super_admin, UserRole.user),
  validationMiddleware(createNotificationValidationSchema),
  NotificationController.createNotification
);

router.put(
  "/mark-read/:notificationId",
  AuthMiddleware(UserRole.admin, UserRole.user),
  NotificationController.markAsRead
);

router.get(
  "/get-user-notifications",
  AuthMiddleware(UserRole.admin, UserRole.user),
  NotificationController.getUserNotifications
);

export const NotificationRoutes = router;
