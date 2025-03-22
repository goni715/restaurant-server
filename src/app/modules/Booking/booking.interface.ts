import { Types } from "mongoose";


export type TPaymentStatus = "paid" | "unpaid";
export type TBookingStatus = "pending" | "confirmed" | "cancelled";
export type IAvailability = "Immediate seating" | "Waitlist";

export interface IBooking {
    scheduleId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    userId: Types.ObjectId;
    price: number;
    guest: number;
    paymentStatus: TPaymentStatus;
    status: TBookingStatus;
    availability: IAvailability;
}


export interface IBookingPayload {
    scheduleId: Types.ObjectId;
    price: number;
    guest: number;
}