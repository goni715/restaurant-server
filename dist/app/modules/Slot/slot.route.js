"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const slot_controller_1 = __importDefault(require("./slot.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const slot_validation_1 = require("./slot.validation");
const router = express_1.default.Router();
router.post("/create-slot", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), (0, validationMiddleware_1.default)(slot_validation_1.createSlotSchema), slot_controller_1.default.createSlot);
router.get("/get-slots", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), slot_controller_1.default.getSlots);
router.get("/get-slot-drop-down", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), slot_controller_1.default.getSlotDropDown);
router.delete("/delete-slot/:slotId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), slot_controller_1.default.deleteSlot);
exports.SlotRoutes = router;
