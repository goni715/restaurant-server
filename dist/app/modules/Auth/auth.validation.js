"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.forgotPassCreateNewPassSchema = exports.forgotPassVerifyOtpSchema = exports.forgotPassSendOtpSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    fullName: zod_1.z.string({
        required_error: "Full Name is required",
    }),
    email: zod_1.z.string().email(),
    country: zod_1.z.string({
        required_error: "Country is required",
    }),
    university: zod_1.z.string({
        required_error: "University is required",
    }),
    profession: zod_1.z.string({
        required_error: "Profession is required",
    }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .trim(),
    role: zod_1.z
        .enum(["user", "admin"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
        .default("user"),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
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
