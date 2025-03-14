"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const quizSchema = new mongoose_1.Schema({
    quiz: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (options) {
                return options.length >= 2; // Ensure at least two options
            },
            message: "There must be at least two options.",
        },
    },
    answer: {
        type: String,
        required: true,
        validate: {
            validator: function (answer) {
                return this.options.includes(answer);
            },
            message: "Answer must be one of the provided options.",
        },
    },
    explanation: {
        type: String,
        required: true
    },
    readingTime: {
        type: Number,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
});
const QuizModel = (0, mongoose_1.model)('Quiz', quizSchema);
exports.default = QuizModel;
