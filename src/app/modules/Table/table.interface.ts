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

<<<<<<< HEAD
export interface ITablePayload{
  scheduleId: Types.ObjectId;
  diningId: Types.ObjectId;
  totalTable:number;
  seats: number;
} 

=======
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
>>>>>>> 852cf8fceb280888b3558bbd0b661b1f93d94b70

export type TTableQuery = {
    page?: string;
    limit?: string;
    date?: string;
};