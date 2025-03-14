"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true
    },
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
        trim: true
    },
    intervalTimes: {
        type: [Number],
        default: [24, 48, 72, 144, 288, 576]
    }, // 6 intervals in hours
    lastReviewed: {
        type: Date,
        default: Date.now
    },
    nextReview: {
        type: Date,
        default: function () { return new Date(Date.now() + 24 * 60 * 60 * 1000); }
    }, // Next review 24h later
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
});
const ReviewModel = (0, mongoose_1.model)('Review', reviewSchema);
exports.default = ReviewModel;
