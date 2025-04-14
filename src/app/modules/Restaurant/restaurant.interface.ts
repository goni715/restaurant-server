import { Types } from "mongoose";

export type TRestaurantStatus = "active" | "deactive";
export type TApprovedStatus = "pending" | "accepted" | "cancelled";

export interface IRestaurant {
    ownerId: Types.ObjectId;
    name: string;
    dining: Types.ObjectId[];
    location: string;
    keywords?: string[],
    features?: string[];
    ratings?: number;
    restaurantImg?: string;
    discount?: string;
    cancellationPercentage?: number;
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


export type IChangeRestaurantStatus = {
  status: TRestaurantStatus;
}

export type IChangeApprovalStatus = "accepted" | "cancelled";