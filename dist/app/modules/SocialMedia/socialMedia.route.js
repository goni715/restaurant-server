"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const socialMedia_validation_1 = require("./socialMedia.validation");
const socialMedia_controller_1 = __importDefault(require("./socialMedia.controller"));
const router = express_1.default.Router();
router.post('/create-social-media', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), (0, validationMiddleware_1.default)(socialMedia_validation_1.socialMediaSchema), socialMedia_controller_1.default.createSocialMedia);
router.get('/get-social-media', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), socialMedia_controller_1.default.getSocialMedia);
router.patch('/update-social-media', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), (0, validationMiddleware_1.default)(socialMedia_validation_1.socialMediaSchema), socialMedia_controller_1.default.updateSocialMedia);
router.delete('/delete-social-media', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner), socialMedia_controller_1.default.deleteSocialMedia);
exports.SocialMediaRoutes = router;
