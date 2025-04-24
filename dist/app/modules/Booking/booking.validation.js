"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingWithPaymentSchema = exports.createBookingWithoutPaymentSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createBookingWithoutPaymentSchema = zod_1.z.object({
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
    guest: zod_1.z
        .number()
        .positive("Guest must be a positive number")
        .min(1, "guest must be at least 1"),
});
exports.createBookingWithPaymentSchema = zod_1.z.object({
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
    amount: zod_1.z.number().positive("amount must be positive number"),
    guest: zod_1.z
        .number()
        .positive("Guest must be a positive number")
        .min(1, "guest must be at least 1"),
});
