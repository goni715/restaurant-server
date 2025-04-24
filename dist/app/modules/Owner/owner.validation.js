"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOwnerValidationSchema = void 0;
const zod_1 = require("zod");
exports.createOwnerValidationSchema = zod_1.z.object({
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
    address: zod_1.z.string({
        required_error: "address is required",
    }),
    password: zod_1.z
        .string({
        required_error: "password is required",
    })
        .min(6, "Password minimum 6 characters long")
        .trim(),
});
