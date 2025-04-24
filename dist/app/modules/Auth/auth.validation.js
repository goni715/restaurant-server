"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidationSchema = exports.deleteAccountValidationSchema = exports.changeStatusValidationSchema = exports.changePasswordSchema = exports.forgotPassCreateNewPassSchema = exports.forgotPassVerifyOtpSchema = exports.forgotPassSendOtpSchema = exports.loginValidationSchema = void 0;
const zod_1 = require("zod");
exports.loginValidationSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "email is required"
    }).email(),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .trim(),
});
exports.forgotPassSendOtpSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email()
        .trim(),
});
exports.forgotPassVerifyOtpSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email()
        .trim(),
    otp: zod_1.z
        .string({
        required_error: "Otp is required",
    })
        .min(4, "otp must be 4 characters long")
        .max(4, "otp must be 4 characters long")
        .trim(),
});
exports.forgotPassCreateNewPassSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email()
        .trim(),
    otp: zod_1.z
        .string({
        required_error: "Otp is required",
    })
        .min(4, "otp must be 4 characters long")
        .max(4, "otp must be 4 characters long")
        .trim(),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .trim(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string({
        required_error: "Current Password is required",
    })
        .min(6, "CurrePassword minimum 6 characters long")
        .trim(),
    newPassword: zod_1.z
        .string({
        required_error: "New Password is required",
    })
        .min(6, "New Password minimum 6 characters long")
        .trim()
});
exports.changeStatusValidationSchema = zod_1.z.object({
    status: zod_1.z.enum(["blocked", "unblocked"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
});
exports.deleteAccountValidationSchema = zod_1.z.object({
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .trim(),
});
exports.refreshTokenValidationSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({
        required_error: 'Refresh token is required !'
    })
});
