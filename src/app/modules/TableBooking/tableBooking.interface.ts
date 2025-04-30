import { Types } from "mongoose";

export type ITableAvailability = "Waitlist" | "Seating" | "Booked" | "Completed";

export interface ITableBooking {
    name: string;
    token: string;
    guest: number;
    tableId: Types.ObjectId;
    scheduleId: Types.ObjectId;
    ownerId: Types.ObjectId;
    diningId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    availability: ITableAvailability;
}

export type TTableBookingQuery = {
    searchTerm?:string,
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    date?: string;
};