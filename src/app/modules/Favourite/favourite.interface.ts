import { Types } from "mongoose";


export interface IFavourite{
    userId: Types.ObjectId;
    restaurantId: Types.ObjectId;
}



export type TFavouriteQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  "restaurant.cuisine"?: string;
  "restaurant.price"?: number;
  "restaurant.dining"?: string;
  "restaurant.ratings"?: number;
};