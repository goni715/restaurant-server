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
    featured?: string;
    ratings?: number;
    price: number;
    restaurantImg?: string;
}


export interface IRestaurantPayload {
    ownerData: IUser,
    restaurantData: IRestaurant
}