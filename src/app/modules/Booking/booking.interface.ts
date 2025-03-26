import { Types } from "mongoose";


export type TPaymentStatus = "paid" | "unpaid";
export type TBookingStatus = "pending" | "completed" | "cancelled";

export interface IBooking {
    scheduleId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    userId: Types.ObjectId;
    diningId: Types.ObjectId;
    amount: number;
    guest: number;
    paymentStatus: TPaymentStatus;
    status: TBookingStatus;
    cancellationCharge: number;
}


export interface IBookingPayload {
    scheduleId: Types.ObjectId;
    diningId: Types.ObjectId;
    amount: number;
    guest: number;
}


export type TBookingQuery = {
    searchTerm?:string,
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    date?: string;
    paymentStatus?: TPaymentStatus;
    status?: TBookingStatus;
};