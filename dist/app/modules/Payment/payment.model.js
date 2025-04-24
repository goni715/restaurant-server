"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Booking",
    },
    transactionId: {
        type: String,
        unique: true,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    },
}, {
    timestamps: true,
    versionKey: false,
});
const PaymentModel = (0, mongoose_1.model)('Payment', paymentSchema);
exports.default = PaymentModel;
