/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
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
import BookingModel from "../Booking/booking.model";
import DiningModel from "../Dining/dining.model";

const createReservationService = async (
  loginUserId: string,
  payload: IReservationPayload
) => {
  const { scheduleIds,dinings, seats } = payload;

  //check restaurant
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }



  //check diningId
  for (let i = 0; i < dinings.length; i++) {
    const dining = await DiningModel.findOne({
      ownerId: loginUserId,
      _id: dinings[i],
    });
    if(!dining){
      throw new AppError(404, `This "${dinings[i]}" Id not found, please provide correct all diningId`)
    }
  }


  //check scheduleId
  let scheduleIdsArray = [];
  for (let i = 0; i < scheduleIds.length; i++) {
    const schedule = await ScheduleModel.findOne({
      ownerId: loginUserId,
      _id: scheduleIds[i],
    });
    if(!schedule){
      throw new AppError(404, `This "${scheduleIds[i]}" Id not found, please provide correct all Schedule Id`)
    }
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
        dinings,
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
    date,
    ...filters // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

 
  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

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
        scheduleId: 1,
        seats: 1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
      },
    },
    {
      $match: {
        ...filterQuery
      }
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    {
      $group: {
        _id: "$date",
        totalSeats: { $sum: "$seats" },
        totalSchedules: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalSeats: 1,
        totalSchedules: 1,
      },
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
  if (!isValidDate(date)) {
    throw new AppError(400, "Provide Valid Date");
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
        from: "dinings",
        localField: "dinings",
        foreignField: "_id",
        as: "Dinings",
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
        diningIds: "$dinings",
        dinings: {
          $map: {
            input: "$Dinings",
            as: "dining",
            // in: {
            //   diningId: "$$dining._id", // Extract _id as diningId
            //   diningName: "$$dining.name", // Extract name as diningName
            // },
            in:"$$dining.name"
          },
        }
      },
    },
    {
      $match: {
        ...filterQuery,
      },
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
        totalDining: {$size: "$dinings"}
      },
    },
    { $sort: { date: -1 } },
  ]);

  const modifiedResult =
    result?.length > 0
      ? result?.map((reservation) => ({
          _id: reservation._id,
          date: reservation.date,
          seats: reservation.seats,
          totalDining: reservation?.totalDining,
          dinings:reservation?.dinings,
          diningIds:reservation?.diningIds,
          time:
            convertUTCtimeString(reservation.startDateTime) +
            " - " +
            convertUTCtimeString(reservation.endDateTime),
        }))
      : [];

  return modifiedResult;
};

const getUserReservationsByDateService = async (
  restaurantId: string,
  date: string
) => {
  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  if (!isValidDate(date)) {
    throw new AppError(400, "Provide Valid Date");
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
        restaurantId: new ObjectId(restaurantId),
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
      $match: {
        ...filterQuery,
      },
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    { $sort: { date: -1 } },
  ]);

  const modifiedResult =
    result?.length > 0
      ? result?.map((reservation) => ({
          _id: reservation._id,
          date: reservation.date,
          time:
            convertUTCtimeString(reservation.startDateTime) +
            " - " +
            convertUTCtimeString(reservation.endDateTime),
        }))
      : [];

  return modifiedResult;
};

const getSingleReservationService = async (reservationId: string) => {
  const result = await ReservationModel.aggregate([
    {
      $match: {
        _id: new ObjectId(reservationId),
      }
    },
    {
      $lookup: {
        from: "dinings",
        localField: "dinings",
        foreignField: "_id",
        as: "dinings",
      },
    },
    {
      $project: {
        _id: 1,
        seats: 1,
        dinings: {
          $map: {
            input: "$dinings",
            as: "dining",
            in: {
              diningId: "$$dining._id", // Extract _id as diningId
              diningName: "$$dining.name", // Extract name as diningName
            },
          },
        }
      },
    },
  ])
  if (result.length ===0) {
    throw new AppError(404, "Reservation Not Found");
  }

  return result[0];
};

const updateReservationService = async (
  loginUserId: string,
  reservationId: string,
  payload: Partial<IReservationPayload>
) => {
  const reservation = await ReservationModel.findOne({
    _id: reservationId,
    ownerId: loginUserId,
  });

  if (!reservation) {
    throw new AppError(404, "Reservation Not Found");
  }

  const result = await ReservationModel.updateOne(
    { _id: reservationId },
    payload
    //{ runValidators:true } //mongoose valid will be working, When you want to update
  );
  return result;
};

const deleteReservationService = async (
  loginUserId: string,
  reservationId: string
) => {
  const reservation = await ReservationModel.findOne({
    _id: reservationId,
    ownerId: loginUserId,
  });

  if (!reservation) {
    throw new AppError(404, "Reservation Not Found");
  }

  //check associate with booking
  const associateWithBooking = await BookingModel.findOne({
    scheduleId: reservation.scheduleId,
    ownerId: reservation.ownerId,
    restaurantId: reservation.restaurantId,
  });
  if (associateWithBooking) {
    throw new AppError(
      409,
      "Failled to delete, This Schedule is associated with Booking"
    );
  }
  const result = await ReservationModel.deleteOne({
    _id: reservationId,
    ownerId: loginUserId,
  });
  return result;
};

export {
  createReservationService,
  getReservationsService,
  getReservationsByDateService,
  getUserReservationsByDateService,
  getSingleReservationService,
  updateReservationService,
  deleteReservationService,
};
