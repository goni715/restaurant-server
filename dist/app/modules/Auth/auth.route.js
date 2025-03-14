"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post('/register-user', (0, validateRequest_1.default)(auth_validation_1.registerUserSchema), auth_controller_1.registerUser);
router.post('/login-user', (0, validateRequest_1.default)(auth_validation_1.loginUserSchema), auth_controller_1.loginUser);
router.post('/login-admin', (0, validateRequest_1.default)(auth_validation_1.loginUserSchema), auth_controller_1.loginAdmin);
//firgot-password
router.post('/forgot-pass-send-otp', (0, validateRequest_1.default)(auth_validation_1.forgotPassSendOtpSchema), auth_controller_1.forgotPassSendOtp);
router.post('/forgot-pass-verify-otp', (0, validateRequest_1.default)(auth_validation_1.forgotPassVerifyOtpSchema), auth_controller_1.forgotPassVerifyOtp);
router.post('/forgot-pass-create-new-pass', (0, validateRequest_1.default)(auth_validation_1.forgotPassCreateNewPassSchema), auth_controller_1.forgotPassCreateNewPass);
router.put('/change-password', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.user), (0, validateRequest_1.default)(auth_validation_1.changePasswordSchema), auth_controller_1.changePassword);
exports.AuthRoutes = router;
