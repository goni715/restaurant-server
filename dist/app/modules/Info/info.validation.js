"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInfoSchema = void 0;
const zod_1 = require("zod");
exports.createInfoSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        required_error: "Title is required",
    })
        .min(1, "Title is required")
        .trim(),
    subTitle: zod_1.z
        .string({
        required_error: "Sub Title is required",
    })
        .min(1, "Sub Title is required")
        .trim(),
    explainOne: zod_1.z
        .string({
        required_error: "explainOne is required",
    })
        .min(1, "explainOne is required")
        .trim(),
    explainTwo: zod_1.z
        .string({
        required_error: "explainTwo is required",
    })
        .min(1, "explainTwo is required")
        .trim()
});
