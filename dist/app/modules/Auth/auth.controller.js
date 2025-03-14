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
exports.changePassword = exports.forgotPassCreateNewPass = exports.forgotPassVerifyOtp = exports.forgotPassSendOtp = exports.loginAdmin = exports.loginUser = exports.registerUser = void 0;
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.registerUserService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User is registered successfully",
        data: result
    });
}));
exports.registerUser = registerUser;
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.loginUserService)(req.body);
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
        message: "User is logged in successfully",
        data: {
            accessToken
        }
    });
}));
exports.loginUser = loginUser;
const loginAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.loginAdminService)(req.body);
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
        message: "Admin is logged in successfully",
        data: {
            accessToken
        }
    });
}));
exports.loginAdmin = loginAdmin;
//forgot-password
//step-01
const forgotPassSendOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield (0, auth_service_1.forgotPassSendOtpService)(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Email is verified & Otp is sent successfully",
        data: result
    });
}));
exports.forgotPassSendOtp = forgotPassSendOtp;
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
exports.forgotPassVerifyOtp = forgotPassVerifyOtp;
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
exports.forgotPassCreateNewPass = forgotPassCreateNewPass;
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
exports.changePassword = changePassword;
