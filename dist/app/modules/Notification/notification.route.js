"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const notification_controller_1 = __importDefault(require("./notification.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const notification_validation_1 = require("./notification.validation");
const router = express_1.default.Router();
router.post("/create-notification", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner, user_constant_1.UserRole.super_admin, user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(notification_validation_1.createNotificationValidationSchema), notification_controller_1.default.createNotification);
router.patch("/mark-read/:notificationId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner, user_constant_1.UserRole.user), notification_controller_1.default.markAsRead);
router.get("/get-user-notifications", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner, user_constant_1.UserRole.user), notification_controller_1.default.getUserNotifications);
router.delete("/delete-notification/:notificationId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner, user_constant_1.UserRole.user, user_constant_1.UserRole.super_admin), notification_controller_1.default.deleteNotification);
exports.NotificationRoutes = router;
