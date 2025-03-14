"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameSessionSchema = new mongoose_1.Schema({
    players: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }], // Two players
    quizzes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        }],
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true,
    versionKey: false,
});
const GameSessionModel = (0, mongoose_1.model)('GameSession', gameSessionSchema);
exports.default = GameSessionModel;
