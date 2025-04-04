import { Types } from "mongoose";


export interface ITable {
    name: string;
    scheduleId: Types.ObjectId;
    diningId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    ownerId: Types.ObjectId;
    seats: number;
}