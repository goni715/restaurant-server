"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const quizAnswerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    selectedOption: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
    responseTime: {
        type: Number,
        required: true
    },
    review: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false,
});
const QuizAnswerModel = (0, mongoose_1.model)("QuizAnswer", quizAnswerSchema);
exports.default = QuizAnswerModel;
