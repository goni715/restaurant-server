"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RandomSessionSchema = new mongoose_1.Schema({
    players: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        validate: [
            (val) => val.length >= 1 && val.length <= 2,
            'Players must be between 1 and 2',
        ],
        required: true,
    },
    quizzes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        }],
    status: {
        type: String,
        enum: ['active', 'accepted', 'removed'],
        required: true,
        default: 'active'
    },
}, { timestamps: true, versionKey: false });
const RandomSessionModel = (0, mongoose_1.model)('RandomSession', RandomSessionSchema);
exports.default = RandomSessionModel;
