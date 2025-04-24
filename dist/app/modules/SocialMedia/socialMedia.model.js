"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const socialMediaSchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "Restaurant",
    },
    website: {
        type: String,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    youtube: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    other: {
        type: String,
        trim: true
    },
}, {
    timestamps: true,
    versionKey: false
});
const SocialMediaModel = (0, mongoose_1.model)("SocialMedia", socialMediaSchema);
exports.default = SocialMediaModel;
