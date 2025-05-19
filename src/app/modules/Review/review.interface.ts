import { Types } from "mongoose";


export interface IReview {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  ownerId: Types.ObjectId,
  bookingId: Types.ObjectId;
  star: Number;
  comment: String;
  hidden: boolean,
}

export interface IReviewPayload {
  bookingId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  star: Number;
  comment: String;
}

export type TReviewQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  star?:number
};