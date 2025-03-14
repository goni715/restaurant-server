"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFriendSchema = void 0;
const zod_1 = require("zod");
exports.makeFriendSchema = zod_1.z.object({
    friendId: zod_1.z
        .string({
        required_error: "friendId is required",
    })
        .min(1, "friendId is required")
        .trim(),
});
