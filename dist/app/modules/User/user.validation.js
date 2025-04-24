"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
exports.createUserValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string({
        required_error: "full Name is required",
    }),
    email: zod_1.z
        .string({
        required_error: "email is required",
    })
        .email(),
    phone: zod_1.z.string({
        required_error: "phone number is required",
    }),
    password: zod_1.z
        .string({
        required_error: "password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .trim()
});
exports.updateProfileValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional()
});
