"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const infoSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    subTitle: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    explainOne: {
        type: String,
        required: true,
    },
    explainTwo: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const InfoModel = (0, mongoose_1.model)("Info", infoSchema);
exports.default = InfoModel;
