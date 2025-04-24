"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewValidationSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createReviewValidationSchema = zod_1.z.object({
    restaurantId: zod_1.z
        .string({
        required_error: "restaurantId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "restaurantId must be a valid ObjectId",
    }),
    star: zod_1.z
        .number()
        .min(0.5, { message: "Rating must be at least 0" }) // Minimum rating is 0
        .max(5, { message: "Rating must not exceed 5" }) // Maximum rating is 5
        .refine((val) => val % 0.5 === 0, {
        message: "Rating must be in increments of 0.5",
    }),
    comment: zod_1.z.string({
        required_error: "Comment is required",
    }),
});
