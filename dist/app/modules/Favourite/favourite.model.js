"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favouriteSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    restaurantId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Restaurant" }
}, {
    timestamps: true,
    versionKey: false
});
const FavouriteModel = (0, mongoose_1.model)("Favourite", favouriteSchema);
exports.default = FavouriteModel;
