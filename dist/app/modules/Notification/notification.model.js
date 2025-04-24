"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["info", "warning", "success", "error"],
        default: "info",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });
const NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema);
exports.default = NotificationModel;
