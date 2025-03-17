import { Types } from "mongoose";


export interface IReview {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  star: Number;
  comment: String;
  hidden: boolean,
}

export interface IReviewPayload {
  restaurantId: Types.ObjectId;
  star: Number;
  comment: String;
}