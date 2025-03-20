import { Types } from "mongoose";


export interface IMenu {
    ownerId: Types.ObjectId,
    restaurantId: Types.ObjectId,
    cuisineId: Types.ObjectId;
    name: string;
    slug: string;
    price: number;
    ratings?: number;
    ingredient: string;
}