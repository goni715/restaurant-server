"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCuisineValidationSchema = exports.createCuisineValidationSchema = void 0;
const zod_1 = require("zod");
exports.createCuisineValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "name is required",
    })
        .trim(),
});
exports.updateCuisineValidationSchema = zod_1.z.object({
    name: zod_1.z.string().trim().optional(),
});
