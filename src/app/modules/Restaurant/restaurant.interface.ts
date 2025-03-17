import { Types } from "mongoose";

export type TRestaurantStatus = "active" | "deactive";
export type TApprovedStatus = "pending" | "accepted" | "cancelled";

export interface IRestaurant {
    ownerId: Types.ObjectId;
    name: string;
    website?: string;
    cuisine: string;
    dining: string;
    location: string;
    keywords?: string[],
    features?: string[];
    ratings?: number;
    price: number;
    restaurantImg?: string;
    discount?: string;
    status: TRestaurantStatus;
    approved: TApprovedStatus
}


export type TRestaurantQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  cuisine?: string;
  price?: number;
  dining?:string;
  ratings?:number;
  status?: TRestaurantStatus
};


export type TUserRestaurantQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  cuisine?: string;
  price?: number;
  dining?:string;
  ratings?:number;
};