import { Types } from "mongoose";


export interface ITable {
    name: string;
    slug: string;
    scheduleId: Types.ObjectId;
    diningId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    ownerId: Types.ObjectId;
    seats: number;
}

export interface ITablePayload {
    totalTable: number;
    scheduleId: Types.ObjectId;
    diningId: Types.ObjectId;
    seats: number;
}

export interface IUpdateTablePayload {
    name: string;
    slug: string;
    seats: number;
}

export type TTableQuery = {
    page?: string;
    limit?: string;
    date?: string;
};