import { Types } from "mongoose";

export type ITableAvailability = "Immediate Seating" | "Waitlist";

export interface ITableBooking {
    name: string;
    token: string;
    guest: number;
    tableId: Types.ObjectId;
    scheduleId: Types.ObjectId;
    diningId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    availability: ITableAvailability;
}