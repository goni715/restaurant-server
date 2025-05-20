/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import {
  IReservationPayload,
  TReservationQuery,
} from "./Reservation.interface";
import ReservationModel from "./Reservation.model";
import { makeFilterQuery } from "../../helper/QueryBuilder";
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
  const { scheduleId,diningId, seats } = payload;

  //check restaurant
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

   // //check schedule
    const schedule = await ScheduleModel.findOne({
        ownerId: loginUserId,
        _id: scheduleId
    });

    if(!schedule){
        throw new AppError(404, "Schedule not found");
    }

    //check dining
    const dining = await DiningModel.findOne({
      ownerId: loginUserId,
      _id: diningId,
      restaurantId: restaurant._id
    })
     if(!dining){
      throw new AppError(404, 'This dining not found');
     }

     //check if already exist
     const calendar = await ReservationModel.findOne({
       ownerId: loginUserId,
       restaurantId: restaurant?._id,
       scheduleId,
       diningId,
     })

    if(calendar){
      throw new AppError(409, "Reservation is already exist")
    }

     const result = await ReservationModel.create({
       ownerId: loginUserId,
       restaurantId: restaurant?._id,
       scheduleId,
       diningId,
       seats,
     });

     return result
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
      $lookup: {
        from: "dinings",
        localField: "diningId",
        foreignField: "_id",
        as: "dining"
      }
    },
    {
      $unwind: "$dining"
    },
    {
      $project: {
        scheduleId: "$scheduleId",
        diningId: "$diningId",
        seats:1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name"
      }
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
      $sort: {
        startDateTime:1, endDateTime:1
      }
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

   const modifiedResult =
    result?.length > 0
      ? result?.map((reservation) => ({
          _id: reservation._id,
          scheduleId: reservation?.scheduleId,
          diningId: reservation?.diningId,
          diningName: reservation?.diningName,
          date: reservation.date,
          seats: reservation.seats,
          count: reservation.count,
          time:
            convertUTCtimeString(reservation.startDateTime) +
            " - " +
            convertUTCtimeString(reservation.endDateTime),
        }))
      : [];


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
    data: modifiedResult,
  };
};



const getReservationsByScheduleIdAndDiningIdService = async (
  loginUserId: string,
  scheduleId: string,
  diningId: string
) => {


  // //check schedule
    const schedule = await ScheduleModel.findOne({
        ownerId: loginUserId,
        _id: scheduleId
    });

    if(!schedule){
        throw new AppError(404, "Schedule not found");
    }

    //check dining
    const dining = await DiningModel.findOne({
      ownerId: loginUserId,
      _id: diningId,
    })
     if(!dining){
      throw new AppError(404, 'This dining not found');
     }

  const result = await ReservationModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
        scheduleId: new ObjectId(scheduleId),
        diningId: new ObjectId(diningId)
      },
    },
    // {
    //   $group: {
    //     _id: {
    //       scheduleId: 
    //     },
    //     seats: {
    //       $sum: "$seats"
    //     },
    //     count: {
    //       $sum:1
    //     },
    //   }
    // },
    // {
    //   $lookup: {
    //     from: "schedules",
    //     localField: "_id", //scheduleId
    //     foreignField: "_id",
    //     as: "schedule",
    //   },
    // },
    // {
    //   $unwind: "$schedule",
    // },
    // {
    //   $project: {
    //     _id: 1,
    //     seats: 1,
    //     scheduleId:1,
    //     diningId:1,
    //     count:1,
    //     startDateTime: "$schedule.startDateTime",
    //     endDateTime: "$schedule.endDateTime",
    //   },
    // },
    // {
    //   $match: {
    //     ...filterQuery,
    //   },
    // },
    // {
    //   $addFields: {
    //     date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
    //   },
    // },
    // { $sort: { startDateTime: 1, endDateTime:1, createdAt:-1 } },
  ]);

  const modifiedResult =
    result?.length > 0
      ? result?.map((reservation) => ({
          _id: reservation._id,
          scheduleId: reservation?.scheduleId,
          diningId: reservation?.diningId,
          date: reservation.date,
          seats: reservation.seats,
          count: reservation.count,
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
        scheduleId:1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        createdAt: 1
      },
    },
    {
      $match: {
        ...filterQuery,
      },
    },
    {
      $group: {
        _id: "$scheduleId"
      }
    },
      {
      $lookup: {
        from: "schedules",
        localField: "_id", //scheduleId
        foreignField: "_id",
        as: "schedule",
      },
    },
    {
      $unwind: "$schedule",
    },
    {
      $project: {
        _id: 0,
        scheduleId:"$_id",
        restaurantId: "$schedule.restaurantId",
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        createdAt: 1
      },
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    { $sort: { startDateTime: 1, endDateTime:1 } },
  ]);

  const modifiedResult =
    result?.length > 0
      ? result?.map((reservation) => ({
          scheduleId: reservation?.scheduleId,
          restaurantId: reservation.restaurantId,
          date: reservation.date,
          time:
            convertUTCtimeString(reservation.startDateTime) +
            " - " +
            convertUTCtimeString(reservation.endDateTime),
        }))
      : [];

  return modifiedResult;
};

const getDiningsByRestaurantIdAndScheduleIdService = async (
  restaurantId: string,
  scheduleId: string
) => {

  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

   // //check schedule
    const schedule = await ScheduleModel.findOne({
        restaurantId,
        _id: scheduleId
    });

    if(!schedule){
        throw new AppError(404, "Schedule not found");
    }

  const result = await ReservationModel.aggregate([
    {
      $match: {
        restaurantId: new ObjectId(restaurantId),
        scheduleId: new ObjectId(scheduleId),
      },
    },
    {
      $lookup: {
        from: "dinings",
        localField: "diningId",
        foreignField: "_id",
        as: "dining"
      }
    },
    {
      $unwind: "$dining"
    },
    {
      $project: {
        _id: 0,
        //scheduleId:1,
        diningId:1,
        diningName: "$dining.name",
      },
    },
    { $sort: { startDateTime: 1, endDateTime:1 } },
  ]);

  return result;
};

const getSeatsByDiningIdService = async (diningId: string) => {
  const dining = await DiningModel.findById(diningId);
  if (!dining) {
    throw new AppError(404, "dining Not Found");
  }

  // //check reservation
  const reservation = await ReservationModel.findOne({
    diningId,
    restaurantId: dining.restaurantId,
  }).select("seats -_id");

  if (!reservation) {
    throw new AppError(404, "reservation not found with this diningId");
  }

  return reservation;
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
  getReservationsByScheduleIdAndDiningIdService,
  getDiningsByRestaurantIdAndScheduleIdService,
  getSeatsByDiningIdService,
  getUserReservationsByDateService,
  updateReservationService,
  deleteReservationService,
};
