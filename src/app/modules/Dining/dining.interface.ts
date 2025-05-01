import { Types } from "mongoose";



export interface IDining {
  name: string;
  slug: string;
  ownerId: Types.ObjectId;
  restaurantId : Types.ObjectId;
}


export type TDiningQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};