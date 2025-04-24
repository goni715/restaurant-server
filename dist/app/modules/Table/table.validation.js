"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableValidationSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createTableValidationSchema = zod_1.z.object({
    scheduleId: zod_1.z
        .string({
        required_error: "scheduleId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "scheduleId must be a valid ObjectId",
    }),
    diningId: zod_1.z
        .string({
        required_error: "diningId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "diningId must be a valid ObjectId",
    }),
    totalTable: zod_1.z.number().positive("seats must be a positive number"),
    seats: zod_1.z.number().positive("seats must be a positive number"),
});
