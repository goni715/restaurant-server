import { Types } from "mongoose";

export interface ISlot {
    restaurantId: Types.ObjectId;
    ownerId: Types.ObjectId;
    startTime: string;
    endTime: string;
    startDateTime: Date,
    endDateTime: Date
}


export type TSlotQuery = {
    page?: string;
    limit?: string;
};