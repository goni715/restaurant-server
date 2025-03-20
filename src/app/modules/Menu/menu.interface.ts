import { Types } from "mongoose";


export interface IMenu {
    ownerId: Types.ObjectId,
    restaurantId: Types.ObjectId,
    cuisineId: Types.ObjectId;
    name: string;
    slug: string;
    image: string;
    price: number;
    ratings?: number;
    ingredient: string;
}


export type TMenuQuery = {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    cuisineId?:string
  };