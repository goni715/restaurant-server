import { Types } from "mongoose";
import { IAvailability } from "../Schedule/schedule.interface";


export interface ITableBooking {
    name: string;
    guest: number;
    tableId: Types.ObjectId;
    scheduleId: Types.ObjectId;
    diningId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    availability: IAvailability;
}