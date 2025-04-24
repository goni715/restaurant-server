"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tableSchema = new mongoose_1.Schema({
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
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    seats: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0; // Ensures the number is positive
            },
            message: "seats must be a positive number",
        },
    }
}, {
    timestamps: true,
    versionKey: false,
});
const TableModel = (0, mongoose_1.model)('Table', tableSchema);
exports.default = TableModel;
