import { Types } from "mongoose";


export type TPaymentStatus = "paid" | "unpaid";
export type TBookingStatus = "pending" | "confirmed" | "cancelled";

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