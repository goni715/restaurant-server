import { Types } from "mongoose";



export interface ISocialMedia {
    ownerId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    website?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
    other?: string;
}