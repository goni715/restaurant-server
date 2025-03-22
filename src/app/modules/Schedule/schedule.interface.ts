import { Types } from "mongoose";


export interface ISchedule extends Document {
    restaurantId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    isBooked: boolean;
}


export type TSchedulePayload = {
    startDate: string;
    endDate: string
    startTime: string
    endTime: string 
}



export type TScheduleQuery = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
};