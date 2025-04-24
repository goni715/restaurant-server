"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const table_controller_1 = __importDefault(require("./table.controller"));
const table_validation_1 = require("./table.validation");
const router = express_1.default.Router();
router.post("/create-table", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), (0, validationMiddleware_1.default)(table_validation_1.createTableValidationSchema), table_controller_1.default.createTable);
router.get("/get-tables", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), table_controller_1.default.getTables);
router.get("/get-tables-by-schedule-and-dining/:scheduleId/:diningId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), table_controller_1.default.getTablesByScheduleAndDining);
exports.TableRoutes = router;
