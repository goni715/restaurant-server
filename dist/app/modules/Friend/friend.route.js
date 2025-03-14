"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const friend_controller_1 = require("./friend.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const friend_validation_1 = require("./friend.validation");
const router = express_1.default.Router();
router.post('/make-friend', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(friend_validation_1.makeFriendSchema), friend_controller_1.makeFriend);
router.get('/get-my-friends', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), friend_controller_1.getMyFriends);
router.post('/remove-friend', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(friend_validation_1.makeFriendSchema), friend_controller_1.removeFriend);
exports.FriendRoutes = router;
