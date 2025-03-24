import { Types } from "mongoose";


export interface ISchedule extends Document {
    restaurantId: Types.ObjectId;
    ownerId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    availableSeats: number;
}


export type TSchedulePayload = {
    startDate: string;
    endDate: string
    startTime: string
    endTime: string;
    availableSeats: number;
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