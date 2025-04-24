"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const booking_controller_1 = __importDefault(require("./booking.controller"));
const booking_validation_1 = require("./booking.validation");
const router = express_1.default.Router();
router.post("/create-booking-without-payment", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(booking_validation_1.createBookingWithoutPaymentSchema), booking_controller_1.default.createBookingWithoutPayment);
router.post("/create-booking-with-payment", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(booking_validation_1.createBookingWithPaymentSchema), booking_controller_1.default.createBookingWithPayment);
router.get("/get-bookings", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), booking_controller_1.default.getBookings);
exports.BookingRoutes = router;
