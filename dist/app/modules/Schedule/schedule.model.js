"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const scehduleSchema = new mongoose_1.Schema({
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0; // Ensures the number is positive
            },
            message: "available seats must be a positive number",
        },
    },
    availability: {
        type: String,
        required: true,
        enum: ["Immediate Seating", "Open Reservations", "Waitlist"],
        default: "Immediate Seating"
    },
    bookingFee: {
        type: Number,
        default: 0
    },
    paymentRequired: {
        type: String,
        required: true,
        enum: ["Yes", "No"],
        default: "No"
    },
}, {
    timestamps: true,
    versionKey: false,
});
const ScheduleModel = (0, mongoose_1.model)('Schedule', scehduleSchema);
exports.default = ScheduleModel;
