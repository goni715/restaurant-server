"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const summary_controller_1 = require("./summary.controller");
const router = express_1.default.Router();
router.get('/get-summary', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin), summary_controller_1.getSummarty);
exports.SummaryRoutes = router;
