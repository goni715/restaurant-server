"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const gameSession_controller_1 = require("./gameSession.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const gameSession_validation_1 = require("./gameSession.validation");
const router = express_1.default.Router();
router.post('/create-friend-game-session', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(gameSession_validation_1.createGameSessionSchema), gameSession_controller_1.createFriendGameSession);
router.post('/create-random-game-session', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(gameSession_validation_1.createGameSessionSchema), gameSession_controller_1.createRandomGameSession);
router.put('/update-session-status/:gameSessionId', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(gameSession_validation_1.updateSessionStatusSchema), gameSession_controller_1.updateSessionStatus);
router.get('/get-my-game-sessions/:status', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), gameSession_controller_1.getMyGameSessions);
exports.GameSessionRoutes = router;
