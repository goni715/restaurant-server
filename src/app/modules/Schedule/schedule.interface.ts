import { Types } from "mongoose";

export type IAvailability = "Immediate Seating" | "Open Reservations" | "Waitlist";
export type IPaymentRequired = "Yes" | "No";


export interface ISchedule extends Document {
    restaurantId: Types.ObjectId;
    ownerId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    availableSeats: number;
    availability: IAvailability;
    bookingFee?:number;
    paymentRequired: IPaymentRequired
}


export type TSchedulePayload = {
    duration:number;
    startDate: string;
    endDate: string
    startTime: string
    endTime: string;
    availableSeats: number;
    bookingFee: number;
    availability: IAvailability;
    paymentRequired: IPaymentRequired;
}



export type TScheduleQuery = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    date?: string;
    startDate?: string;
    endDate?: string;
};


export type TUserScheduleQuery = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    date?: string;
};