import { Types } from "mongoose";


export interface IReservation {
  scheduleId: Types.ObjectId;
  ownerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  diningId: Types.ObjectId
  seats?: number;
};


export interface ICalendar {
  scheduleId: Types.ObjectId;
  ownerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  diningId: Types.ObjectId
  seats?: number;
};

export interface IReservationPayload {
  scheduleId: Types.ObjectId;
  diningId: Types.ObjectId;
  seats?: number;
};

export interface ICalendarPayload {
  scheduleId: Types.ObjectId;
  diningId: Types.ObjectId;
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
