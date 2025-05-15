import { Types } from "mongoose";


export interface IReservation {
  scheduleId: Types.ObjectId;
  ownerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  dinings: Types.ObjectId[]
  seats?: number;
};

export interface IReservationPayload {
  scheduleIds: Types.ObjectId[];
  dinings: Types.ObjectId[];
  seats?: number;
};

export type TReservationQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  date?: string,
};
