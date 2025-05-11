/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import { ReservationSearchableFields } from "./Reservation.constant";
import {
  IReservationPayload,
  TReservationQuery,
} from "./Reservation.interface";
import ReservationModel from "./Reservation.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import ScheduleModel from "../Schedule/schedule.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import ObjectId from "../../utils/ObjectId";
import isValidDate from "../../utils/isValidDate";
import convertUTCtimeString from "../../utils/convertUTCtimeString";

const createReservationService = async (
  loginUserId: string,
  payload: IReservationPayload
) => {
  const { scheduleIds, seats } = payload;

  //check restaurant
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  let scheduleIdsArray = [];
  for (let i = 0; i < scheduleIds.length; i++) {
    const schedule = await ScheduleModel.findOne({
      ownerId: loginUserId,
      _id: scheduleIds[i],
    });
    if (schedule) {
      scheduleIdsArray.push(scheduleIds[i]);
    }
  }

  let reservationData = [];
  for (let i = 0; i < scheduleIdsArray.length; i++) {
    const reservation = await ReservationModel.findOne({
      ownerId: loginUserId,
      scheduleId: scheduleIdsArray[i],
    });

    if (!reservation) {
      reservationData.push({
        scheduleId: scheduleIdsArray[i],
        ownerId: loginUserId,
        restaurantId: restaurant?._id,
        seats,
      });
    }
  }

  const result = await ReservationModel.insertMany(reservationData);
  return result;
};

const getReservationsService = async (
  loginUserId: string,
  query: TReservationQuery
) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortOrder = "desc",
    sortBy = "createdAt",
    ...filters // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, ReservationSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ReservationModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $lookup: {
        from: "schedules",
        localField: "scheduleId",
        foreignField: "_id",
        as: "schedule",
      },
    },
    {
      $unwind: "$schedule",
    },
    {
      $project: {
        _id: 1,
        scheduleId: 1,
        seats: 1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
      },
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    {
      $group: {
        _id: "$date",
        totalSeats: { $sum: "$seats"},
      }
    },
    {
      $project: {
        _id:0,
        date: "$_id",
        totalSeats:1
      }
    },
    { $sort: { date: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count
  const totalReservationResult = await ReservationModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
    { $count: "totalCount" },
  ]);

  const totalCount = totalReservationResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

  return {
    meta: {
      page: Number(page), //currentPage
      limit: Number(limit),
      totalPages,
      total: totalCount,
    },
    data: result,
  };
};


const getReservationsByDateService = async (
  loginUserId: string,
  date: string
) => {
  
  if(!isValidDate(date)){
      throw new AppError(400, "Provide Valid Date")
  }

  let filterQuery = {};
  if (date) {
    const start = `${date}T00:00:00.000+00:00`;
    const end = `${date}T23:59:59.999+00:00`;
    filterQuery = {
      startDateTime: { $gte: new Date(start), $lte: new Date(end) },
    };
  }


 
  const result = await ReservationModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $lookup: {
        from: "schedules",
        localField: "scheduleId",
        foreignField: "_id",
        as: "schedule",
      },
    },
    {
      $unwind: "$schedule",
    },
    {
      $project: {
        _id: 1,
        seats: 1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
      },
    },
    {
      $match : {
        ...filterQuery
      }
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    { $sort: { date: -1 } },
  ]);


   const modifiedResult = result?.length > 0 ? result?.map((reservation)=>({
      _id:reservation._id,
      date:reservation.date,
      time: convertUTCtimeString(reservation.startDateTime) + " - " + convertUTCtimeString(reservation.endDateTime)
    })) : []
  
    return modifiedResult;
};

const getSingleReservationService = async (id: string) => {
  const result = await ReservationModel.findById(id);
  if (!result) {
    throw new AppError(404, "Reservation Not Found");
  }

  return result;
};

const updateReservationService = async (
  reservationId: string,
  payload: any
) => {
  const reservation = await ReservationModel.findById(reservationId);
  if (!reservation) {
    throw new AppError(404, "Reservation Not Found");
  }
  const result = await ReservationModel.updateOne(
    { _id: reservationId },
    payload
  );

  return result;
};

const deleteReservationService = async (id: string) => {
  const deletedService = await ReservationModel.deleteOne({ _id: id });

  if (!deletedService) {
    throw new AppError(400, "Failed to delete Reservation");
  }

  return deletedService;
};

export {
  createReservationService,
  getReservationsService,
  getReservationsByDateService,
  getSingleReservationService,
  updateReservationService,
  deleteReservationService,
};
