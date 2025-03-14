"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionStatusSchema = exports.createGameSessionSchema = void 0;
const zod_1 = require("zod");
exports.createGameSessionSchema = zod_1.z.object({
    opponentId: zod_1.z
        .string({
        required_error: "friendId is required",
    })
        .trim()
});
exports.updateSessionStatusSchema = zod_1.z.object({
    status: zod_1.z
        .enum(["accepted", "rejected"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
});
