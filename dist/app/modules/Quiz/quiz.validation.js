"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuizSchema = void 0;
const zod_1 = require("zod");
exports.createQuizSchema = zod_1.z
    .object({
    quiz: zod_1.z
        .string({
        required_error: "Quiz is required",
    })
        .min(1, "Quiz is required")
        .trim(),
    options: zod_1.z.array(zod_1.z.string()).min(2, "There must be at least two options"),
    answer: zod_1.z.string({
        required_error: "Answer is required",
    }),
    explanation: zod_1.z.string({
        required_error: "Answer is required",
    }),
    readingTime: zod_1.z
        .number({ required_error: "readingTime is required" })
        .positive("Reading time must be a positive number"),
    point: zod_1.z
        .number({ required_error: "Point is required" })
        .positive("Point must be a positive number"),
    condition: zod_1.z.string({
        required_error: "Condition is required",
    }),
})
    .superRefine((values, ctx) => {
    const { options, answer } = values;
    if (!options.includes(answer)) {
        ctx.addIssue({
            path: ["answer"],
            message: "Answer must be one of the provided options.",
            code: zod_1.z.ZodIssueCode.custom,
        });
    }
});
