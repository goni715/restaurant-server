"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialMediaSchema = void 0;
const zod_1 = require("zod");
exports.socialMediaSchema = zod_1.z.object({
    website: zod_1.z.string().url().optional(),
    facebook: zod_1.z.string().url().optional(),
    youtube: zod_1.z.string().url().optional(),
    instagram: zod_1.z.string().url().optional(),
    other: zod_1.z.string().optional(),
});
