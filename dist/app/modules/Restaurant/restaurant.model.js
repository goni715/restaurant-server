"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    dining: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Dining",
            required: true,
        }],
    location: {
        type: String,
        required: true,
        trim: true
    },
    keywords: {
        type: [String],
        default: []
    },
    features: {
        type: [String],
        default: []
    },
    discount: {
        type: String,
        trim: true
    },
    ratings: {
        type: Number,
        trim: true,
        default: 0,
    },
    restaurantImg: {
        type: String,
        default: ''
    },
    cancellationPercentage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "deactive"],
        default: 'active'
    },
    approved: {
        type: String,
        enum: ["pending", "accepted", "cancelled"],
        default: 'pending'
    }
}, {
    timestamps: true,
    versionKey: false
});
const RestaurantModel = (0, mongoose_1.model)('Restaurant', restaurantSchema);
exports.default = RestaurantModel;
