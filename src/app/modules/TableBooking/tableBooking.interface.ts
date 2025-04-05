import { Types } from "mongoose";


export interface ITableBooking {
    name: string;
    guest: number;
    tableId: Types.ObjectId;
    scheduleId: Types.ObjectId;
    diningId: Types.ObjectId;
    restaurantId: Types.ObjectId;
}