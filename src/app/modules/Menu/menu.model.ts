import { model, Schema } from "mongoose";
import { IMenu } from "./menu.interface";

const menuSchema = new Schema<IMenu>(
  {
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    cuisineId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Cuisine",
    },
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
    price: {
      type: Number,
      required: true,
      trim: true
    },
    ingredient: {
      type: String,
      required: true,
      trim: true
    },
    ratings: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MenuModel = model<IMenu>("Menu", menuSchema);
export default MenuModel;
