import { Types } from "mongoose";


export interface IReview {
    star: Number;
    comment: String;
    userId: Types.ObjectId;
}