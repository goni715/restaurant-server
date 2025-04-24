"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tableBookingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tableId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Table"
    },
    scheduleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Schedule"
    },
    diningId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Dining"
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    guest: {
        type: Number,
        required: true,
        trim: true
    },
    availability: {
        type: String,
        required: true,
        enum: ["Immediate Seating", "Open Reservations", "Waitlist"],
        default: "Immediate Seating"
    },
}, {
    timestamps: true,
    versionKey: false,
});
const TableBookingModel = (0, mongoose_1.model)('TableBooking', tableBookingSchema);
exports.default = TableBookingModel;
