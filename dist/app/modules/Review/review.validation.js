"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToReviewSchema = void 0;
const zod_1 = require("zod");
exports.addToReviewSchema = zod_1.z.object({
    quizId: zod_1.z.string({
        required_error: "quizId is required"
    }),
});
