"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableBookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const tableBooking_controller_1 = __importDefault(require("./tableBooking.controller"));
const tableBooking_validation_1 = require("./tableBooking.validation");
const router = express_1.default.Router();
router.post("/create-table-booking", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), (0, validationMiddleware_1.default)(tableBooking_validation_1.createTableBookingSchema), tableBooking_controller_1.default.createTableBooking);
exports.TableBookingRoutes = router;
