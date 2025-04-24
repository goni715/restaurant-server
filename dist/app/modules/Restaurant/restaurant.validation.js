"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveRestaurantSchema = exports.changeRestaurantStatusSchema = exports.updateRestaurantValidationSchema = exports.createRestaurantValidationSchema = exports.objectIdSchema = void 0;
const zod_1 = require("zod");
exports.objectIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
exports.createRestaurantValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    dining: zod_1.z.array(exports.objectIdSchema).min(1, "There must be at least one value"),
    location: zod_1.z.string().min(1, "Location is required"),
    keywords: zod_1.z.array(zod_1.z.string()).optional(),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    discount: zod_1.z.string().optional(),
    payment: zod_1.z.boolean().default(false),
    bookingFee: zod_1.z.number().positive("bookingFee must be a positive number").optional(),
    cancellationPercentage: zod_1.z.number().nonnegative().default(0)
});
exports.updateRestaurantValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").optional(),
    website: zod_1.z.string().url("Invalid URL format").optional(),
    cuisine: zod_1.z.string().min(1, "Cuisine is required").optional(),
    dining: zod_1.z.array(exports.objectIdSchema).optional(),
    location: zod_1.z.string().min(1, "Location is required").optional(),
    keywords: zod_1.z.array(zod_1.z.string()).optional().optional(),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    price: zod_1.z.number().min(0, "Price must be at least 0").optional(),
    discount: zod_1.z.string().optional(),
});
exports.changeRestaurantStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["active", "deactive"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
});
exports.approveRestaurantSchema = zod_1.z.object({
    approved: zod_1.z.enum(["pending", "accepted", "cancelled"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
});
