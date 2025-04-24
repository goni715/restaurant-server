"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdministratorSchema = exports.updateAdministratorAccessSchema = exports.createAdministratorSchema = void 0;
const zod_1 = require("zod");
const administrator_constant_1 = require("./administrator.constant");
exports.createAdministratorSchema = zod_1.z.object({
    administratorData: zod_1.z.object({
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
            .optional(),
    }),
    access: zod_1.z.array(zod_1.z.enum(administrator_constant_1.VALID_ACCESS_VALUES)).default([]),
});
exports.updateAdministratorAccessSchema = zod_1.z.object({
    access: zod_1.z.array(zod_1.z.enum(administrator_constant_1.VALID_ACCESS_VALUES)).default([])
});
exports.updateAdministratorSchema = zod_1.z.object({
    fullName: zod_1.z.string({
        required_error: "full Name is required",
    }),
    phone: zod_1.z.string({
        required_error: "phone number is required",
    }),
});
