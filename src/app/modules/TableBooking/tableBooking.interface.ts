import { Types } from "mongoose";

export type ITableAvailability = "Waitlist" | "Seating" | "Booked" | "Completed";

export interface ITableBooking {
    bookingId: Types.ObjectId;
    userId: Types.ObjectId;
    tableId: Types.ObjectId;
    scheduleId: Types.ObjectId;
    ownerId: Types.ObjectId;
    diningId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    guest: number;
}

export type TTableBookingQuery = {
    searchTerm?:string,
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    date?: string;
};