"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const menuSchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    cuisineId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Cuisine",
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    ingredient: {
        type: String,
        required: true,
        trim: true
    },
    ratings: {
        type: Number,
        trim: true,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const MenuModel = (0, mongoose_1.model)("Menu", menuSchema);
exports.default = MenuModel;
