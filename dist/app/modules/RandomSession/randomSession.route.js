"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomSessionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const randomSession_controller_1 = require("./randomSession.controller");
const router = express_1.default.Router();
router.post('/create-random-session', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), randomSession_controller_1.createRandomSession);
router.get('/get-random-sessions', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), randomSession_controller_1.getRandomSessions);
router.put('/accept-random-player/:gameSessionId', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), randomSession_controller_1.acceptRandomPlayer);
router.put('/remove-random-player/:gameSessionId', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), randomSession_controller_1.removeRandomPlayer);
exports.RandomSessionRoutes = router;
