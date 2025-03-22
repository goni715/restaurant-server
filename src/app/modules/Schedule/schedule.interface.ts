import { Types } from "mongoose";


export interface ISchedule extends Document {
    restaurantId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
}