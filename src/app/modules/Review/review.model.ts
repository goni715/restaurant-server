import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";


const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    star: {
      type: Number,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ReviewModel = model<IReview>("Review", reviewSchema);
export default ReviewModel;
  