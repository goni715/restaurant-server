import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
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
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
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
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Comment must be at least 5 characters long"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ReviewModel = model<IReview>("Review", reviewSchema);
export default ReviewModel;
