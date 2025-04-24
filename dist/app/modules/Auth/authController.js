"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.loginUserService)(req.body);
    const { role, accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevents client-side access to the cookie (more secure)
        secure: config_1.default.node_env === "production", // Only use HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
        sameSite: "strict", // Prevents CSRF attacks
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User is logged in successfully",
        data: {
            role,
            accessToken,
            refreshToken
        }
    });
}));
const loginOwner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.loginOwnerService)(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevents client-side access to the cookie (more secure)
        secure: config_1.default.node_env === "production", // Only use HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
        sameSite: "strict", // Prevents CSRF attacks
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Owner is logged in successfully",
        data: {
            accessToken
        }
    });
}));
const loginSuperAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.loginSuperAdminService)(req.body);
    const { accessToken, refreshToken, message } = result;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevents client-side access to the cookie (more secure)
        secure: config_1.default.node_env === "production", // Only use HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
        sameSite: "strict", // Prevents CSRF attacks
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: message,
        data: {
            accessToken
        }
    });
}));
//forgot-password
//step-01
const forgotPassSendOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield (0, auth_service_1.forgotPassSendOtpService)(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Otp is sent to your email address successfully",
        data: result
    });
}));
//step-02
const forgotPassVerifyOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.forgotPassVerifyOtpService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Otp is verified successfully",
        data: result
    });
}));
//step-03
const forgotPassCreateNewPass = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.forgotPassCreateNewPassService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password is reset successfully",
        data: result
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, auth_service_1.changePasswordService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password is updated successfully",
        data: result
    });
}));
const changeStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, auth_service_1.changeStatusService)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User status is changed successfully",
        data: result
    });
}));
const deleteMyAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { password } = req.body;
    const result = yield (0, auth_service_1.deleteMyAccountService)(loginUserId, password);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My account is deleted successfully",
        data: result
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield (0, auth_service_1.refreshTokenService)(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Access token is retrieved successfully !',
        data: result
    });
}));
// const oAuthLogin = catchAsync(async (req, res) => {
//   const result = await oAuthLoginService(req.body);
//   const { role, accessToken, refreshToken} = result;
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,  
//     secure: config.node_env === "production", 
//     maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
//     sameSite: "strict", // Prevents CSRF attacks
//   });
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "User is logged in successfully",
//     data: {
//       role,
//       accessToken,
//       refreshToken
//     }
//   })
//  })
const AuthController = {
    loginUser,
    loginOwner,
    loginSuperAdmin,
    forgotPassSendOtp,
    forgotPassVerifyOtp,
    forgotPassCreateNewPass,
    changePassword,
    changeStatus,
    deleteMyAccount,
    refreshToken,
};
exports.default = AuthController;
