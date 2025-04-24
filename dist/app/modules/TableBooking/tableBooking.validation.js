"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableBookingSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createTableBookingSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "name is required",
    })
        .trim(),
    tableId: zod_1.z
        .string({
        required_error: "tableId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "tableId must be a valid ObjectId",
    }),
    guest: zod_1.z
        .number()
        .positive("Guest must be a positive number")
        .min(1, "guest must be at least 1"),
});
