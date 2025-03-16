import { Types } from "mongoose";


export interface IRestaurant {
    ownerId: Types.ObjectId;
    name: string;
    website: string;
    cuisine: string;
    dining: string;
    location: string;
    keywords?: string[],
    features?: string[];
    ratings?: number;
    price: number;
    restaurantImg?: string;
    discount?: string;
    status: "active" | "deactive";
    approved: "pending" | "accepted" | "cancelled"
}


export const RestaurantValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "cuisine",
  "price",
  "dining",
  "ratings",
  "status"
];


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
  status?: "active" | "deactive"
};