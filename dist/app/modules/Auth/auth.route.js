"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const auth_validation_1 = require("./auth.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const authController_1 = __importDefault(require("./authController"));
const isAccess_1 = __importDefault(require("../../middlewares/isAccess"));
const router = express_1.default.Router();
router.post("/login", (0, validationMiddleware_1.default)(auth_validation_1.loginValidationSchema), authController_1.default.loginUser);
router.post("/login-owner", (0, validationMiddleware_1.default)(auth_validation_1.loginValidationSchema), authController_1.default.loginOwner);
router.post("/login-super-admin", (0, validationMiddleware_1.default)(auth_validation_1.loginValidationSchema), authController_1.default.loginSuperAdmin);
//forgot-password
router.post("/forgot-pass-send-otp", (0, validationMiddleware_1.default)(auth_validation_1.forgotPassSendOtpSchema), authController_1.default.forgotPassSendOtp);
router.post("/forgot-pass-verify-otp", (0, validationMiddleware_1.default)(auth_validation_1.forgotPassVerifyOtpSchema), authController_1.default.forgotPassVerifyOtp);
router.post("/forgot-pass-create-new-pass", (0, validationMiddleware_1.default)(auth_validation_1.forgotPassCreateNewPassSchema), authController_1.default.forgotPassCreateNewPass);
router.patch("/change-password", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner, user_constant_1.UserRole.super_admin, user_constant_1.UserRole.user, user_constant_1.UserRole.administrator), (0, validationMiddleware_1.default)(auth_validation_1.changePasswordSchema), authController_1.default.changePassword);
router.patch("/change-status/:id", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.administrator), (0, isAccess_1.default)('user'), (0, validationMiddleware_1.default)(auth_validation_1.changeStatusValidationSchema), authController_1.default.changeStatus);
router.delete("/delete-my-account", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.owner, user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(auth_validation_1.deleteAccountValidationSchema), authController_1.default.deleteMyAccount);
router.post("/refresh-token", (0, validationMiddleware_1.default)(auth_validation_1.refreshTokenValidationSchema), authController_1.default.refreshToken);
// router.post(
//   "/oauth-login",
//   AuthController.oAuthLogin
// );
exports.AuthRoutes = router;
