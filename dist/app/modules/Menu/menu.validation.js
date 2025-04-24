"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuValidationSchema = exports.createMenuValidationSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createMenuValidationSchema = zod_1.z.object({
    cuisineId: zod_1.z
        .string({
        required_error: "cuisineId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "cuisineId must be a valid ObjectId",
    }),
    name: zod_1.z.string({
        required_error: "name is required",
    }),
    price: zod_1.z.number().positive("Price must be a positive number").min(0, "Price must be at least 0"),
    ingredient: zod_1.z.string({
        required_error: "ingredient is required",
    }),
});
exports.updateMenuValidationSchema = zod_1.z.object({
    cuisineId: zod_1.z
        .string({
        required_error: "cuisineId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "cuisineId must be a valid ObjectId",
    }).optional(),
    name: zod_1.z.string({
        required_error: "name is required",
    }).optional(),
    price: zod_1.z
        .union([
        zod_1.z.number(),
        zod_1.z.string().transform((val) => Number(val)),
    ])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Price must be a number" })
        .refine((val) => val > 0, { message: "Price must be at least 1" })
        .optional(),
    ingredient: zod_1.z.string({
        required_error: "ingredient is required",
    }).optional(),
});
