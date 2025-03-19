import { Types } from "mongoose";



export interface ISocialMedia {
    restaurantId: Types.ObjectId;
    website?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
    other?: string;
}