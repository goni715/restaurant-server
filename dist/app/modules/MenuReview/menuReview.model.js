"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const menuReviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    menuId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Menu",
    },
    star: {
        type: Number,
        required: true,
        trim: true,
        min: [0.5, "Rating must be at least 0.5"],
        max: [5, "Rating must not exceed 5"],
        validate: {
            validator: (value) => value % 0.5 === 0,
            message: "Rating must be in increments of 0.5",
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
const MenuReviewModel = (0, mongoose_1.model)("MenuReview", menuReviewSchema);
exports.default = MenuReviewModel;
