"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationValidationSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createNotificationValidationSchema = zod_1.z.object({
    userId: zod_1.z
        .string({
        required_error: "userId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "userId must be a valid ObjectId",
    }),
    title: zod_1.z.string({
        required_error: "title is required",
    }),
    message: zod_1.z.string({
        required_error: "message is required",
    }),
    type: zod_1.z.enum(["info", "warning", "success", "error"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
        .default("info")
});
