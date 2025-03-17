import { Types } from "mongoose";


export interface IFavourite{
    userId: Types.ObjectId;
    restaurantId: Types.ObjectId;
}