import { Types } from "mongoose";
import { IUser } from "../User/user.interface";

export type TAccess = "dashboard" | "userManagement" | "restaurantManagement" | "settings";

export interface IAdministrator {
    userId: Types.ObjectId;
    access: TAccess[]
}

export interface IAdministratorPayload {
    administratorData: IUser,
    access: TAccess[]
}