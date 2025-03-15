import { Types } from "mongoose";
import { IUser } from "../User/user.interface";


export interface IRestaurant {
    ownerId: Types.ObjectId;
    name: string;
    website: string;
    cuisine: string;
    diningStyle: string;
    location: string;
    keywords?: string[],
    features?: string[];
    ratings?: number;
    price: number;
    restaurantImg?: string;
    cancellationCharge: number;
    discount?: string;
    availability: "Immediate seating" | "Open reservations" | "Waitlist";
    status: "active" | "deactive"
}


export interface IRestaurantPayload {
    ownerData: IUser,
    restaurantData: IRestaurant
}


export const RestaurantValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "cuisine",
  "price",
  "availability",
  "dining",
  "ratings",
];


export type TRestaurantQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  cuisine?: string;
  price?: number;
  availability?: "Immediate seating" | "Open reservations" | "Waitlist";
  dining?:string;
  ratings?:number;
  status: "active" | "deactive"
};