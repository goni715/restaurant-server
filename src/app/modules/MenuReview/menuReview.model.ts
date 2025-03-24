import { model, Schema } from "mongoose";
import { IMenuReview } from "./menuReview.interface";

const menuReviewSchema = new Schema<IMenuReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    menuId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Menu",
    },
    star: {
      type: Number,
      required: true,
      trim: true,
      min: [0.5, "Rating must be at least 0.5"],
      max: [5, "Rating must not exceed 5"],
      validate: {
        validator: (value: number) => value % 0.5 === 0,
        message: "Rating must be in increments of 0.5",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MenuReviewModel = model<IMenuReview>("MenuReview", menuReviewSchema);
export default MenuReviewModel;
