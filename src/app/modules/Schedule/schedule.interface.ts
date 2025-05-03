import { Types } from "mongoose";



export interface ISchedule extends Document {
    restaurantId: Types.ObjectId;
    ownerId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
}


export type TSchedulePayload = {
    startDate: string;
    endDate: string
    slot: {
       startTime: string;
       endTime: string;
    }[];
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