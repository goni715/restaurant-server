"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    scheduleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Schedule",
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    diningId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Dining",
    },
    amount: {
        type: Number,
        default: 0,
        trim: true
    },
    guest: {
        type: Number,
        required: true,
        trim: true
    },
    cancellationCharge: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["pending", "conpleted", "cancelled"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    }
}, {
    timestamps: true,
    versionKey: false,
});
const BookingModel = (0, mongoose_1.model)('Booking', bookingSchema);
exports.default = BookingModel;
