"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    star: {
        type: Number,
        required: true,
        trim: true,
        min: [0.5, "Rating must be at least 0.5"],
        max: [5, "Rating must not exceed 5"],
        validate: {
            validator: (value) => value % 0.5 === 0,
            message: "Rating must be in increments of 0.5",
        },
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Comment must be at least 5 characters long"],
        maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false,
});
const ReviewModel = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = ReviewModel;
