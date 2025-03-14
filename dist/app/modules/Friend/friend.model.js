"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const friendSchema = new mongoose_1.Schema({
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
}, {
    timestamps: true,
});
const FriendModel = (0, mongoose_1.model)("Friend", friendSchema);
exports.default = FriendModel;
