"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("./user.constant");
const router = express_1.default.Router();
router.get('/get-suggested-users', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), user_controller_1.getSuggestedUsers);
exports.UserRoutes = router;
