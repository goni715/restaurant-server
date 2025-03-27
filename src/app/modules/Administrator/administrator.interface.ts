import { Types } from "mongoose";

export type TAccess = "dashboard" | "userManagement" | "restaurantManagement" | "settings";

export interface IAdministrator {
    userId: Types.ObjectId;
    access: TAccess[]
}