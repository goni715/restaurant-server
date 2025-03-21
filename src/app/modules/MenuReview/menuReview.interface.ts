import { Types } from "mongoose";


export interface IMenuReview {
  userId: Types.ObjectId;
  menuId: Types.ObjectId;
  star: Number;
}


export type TMenuReviewQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  star?:number
};