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

export interface ITablePayload{
  scheduleId: Types.ObjectId;
  diningId: Types.ObjectId;
  totalTable:number;
  seats: number;
} 


export type TTableQuery = {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};