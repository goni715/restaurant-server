"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diningValidationSchema = void 0;
const zod_1 = require("zod");
exports.diningValidationSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "name is required"
    })
});
