import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import NotificationController from "./notification.controller";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { createNotificationValidationSchema } from "./notification.validation";

const router = express.Router();

router.post(
  "/create-notification",
  AuthMiddleware(UserRole.owner, UserRole.super_admin, UserRole.user),
  validationMiddleware(createNotificationValidationSchema),
  NotificationController.createNotification
);

router.patch(
  "/mark-read/:notificationId",
  AuthMiddleware(UserRole.owner, UserRole.user),
  NotificationController.markAsRead
);

router.get(
  "/get-user-notifications",
  AuthMiddleware(UserRole.owner, UserRole.user),
  NotificationController.getUserNotifications
);

router.delete(
  "/delete-notification/:notificationId",
  AuthMiddleware(UserRole.owner, UserRole.user, UserRole.super_admin),
  NotificationController.deleteNotification
);

export const NotificationRoutes = router;
