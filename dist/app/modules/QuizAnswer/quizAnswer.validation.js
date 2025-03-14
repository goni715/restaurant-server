"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitQuizAnswerSchema = void 0;
const zod_1 = require("zod");
exports.submitQuizAnswerSchema = zod_1.z.object({
    gameSessionId: zod_1.z
        .string({
        required_error: "gameSessionId is required",
    })
        .trim(),
    quizId: zod_1.z
        .string({
        required_error: "quiId is required",
    })
        .trim(),
    selectedOption: zod_1.z
        .string({
        required_error: "seletedOption is required",
    })
        .trim(),
    responseTime: zod_1.z
        .number({ required_error: "responseTime is required" })
        .positive("Reading time must be a positive number"),
});
