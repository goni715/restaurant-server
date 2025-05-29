import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import {
  IBookingPayload,
  TBookingQuery,
  TBookingStatus,
} from "./booking.interface";
import BookingModel from "./booking.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { BookingSearchFields, MyBookingSearchFields } from "./booking.constant";
import ObjectId from "../../utils/ObjectId";
import ReservationModel from "../Reservation/Reservation.model";
import convertUTCtimeString from "../../utils/convertUTCtimeString";
import PaymentModel from "../Payment/payment.model";
import getPercentageValue from "../../utils/getPercentageValue";
import ScheduleModel from "../Schedule/schedule.model";
import DiningModel from "../Dining/dining.model";

const createBookingWithoutPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { restaurantId, scheduleId, diningId, guest } = payload;
  //check restaurant
  const restaurant = await RestaurantModel.findOne({
    _id: restaurantId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  if (restaurant.paymentRequired) {
    throw new AppError(403, "You have to pay for booking this restaurant");
  }

  // //check schedule
  const schedule = await ScheduleModel.findOne({
    _id: scheduleId,
    restaurantId,
    ownerId: restaurant.ownerId,
  });

  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

  //check dining
  const dining = await DiningModel.findOne({
    ownerId: restaurant.ownerId,
    _id: diningId,
    restaurantId: restaurant._id,
  });
  if (!dining) {
    throw new AppError(404, "This dining not found");
  }

  //check reservation
  const reservation = await ReservationModel.findOne({
    scheduleId: new ObjectId(scheduleId),
    diningId: new ObjectId(diningId),
  });
  if (!reservation) {
    throw new AppError(404, "Reservation Not Found");
  }

  //check availableSeats
  const availableSeats = Number(reservation?.seats);
  if (availableSeats < guest) {
    throw new AppError(
      400,
      "There are no available seats at this moment or schedule"
    );
  }

  //generate token
  const token = Math.floor(100000 + Math.random() * 900000);

  //check you have already booked the 10 seats // you can maximum 10 seats for one day
  // const booking = await BookingModel.aggregate([
  //   {
  //     $match: {
  //       userId: new ObjectId(loginUserId)
  //     }
  //     scheduleId,
  //     restaurantId: restaurantId,
  //     ownerId: restaurant?.ownerId,
  //   },
  // ]);

  // if(booking){
  //   throw new AppError(409, "You have already booked the table")
  // }

  //transaction & rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //database-process-01
    //create the booking
    const newBooking = await BookingModel.create(
      [
        {
          userId: loginUserId,
          scheduleId: reservation?.scheduleId,
          diningId,
          restaurantId: reservation?.restaurantId,
          ownerId: reservation?.ownerId,
          token,
          guest,
        },
      ],
      { session }
    );

    //database-process-02
    //update the reservation seats
    await ReservationModel.updateOne(
      {
        scheduleId: reservation?.scheduleId,
        restaurantId: reservation?.restaurantId,
        ownerId: reservation?.ownerId,
        seats: { $gt: 0 },
      },
      { $inc: { seats: -guest } }, // Decrease seats
      { session }
    );

    await session.commitTransaction();
    await session.endSession();
    return newBooking[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createBookingWithPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { restaurantId, scheduleId, diningId, guest, amount } = payload;

  //check restaurant
  const restaurant = await RestaurantModel.findOne({
    _id: restaurantId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  if (!restaurant?.paymentRequired) {
    throw new AppError(403, "You have not to pay for booking");
  }

  // //check schedule
  const schedule = await ScheduleModel.findOne({
    _id: scheduleId,
    restaurantId,
    ownerId: restaurant.ownerId,
  });

  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

  //check dining
  const dining = await DiningModel.findOne({
    ownerId: restaurant.ownerId,
    _id: diningId,
    restaurantId: restaurant._id,
  });
  if (!dining) {
    throw new AppError(404, "This dining not found");
  }

  //check reservation
  const reservation = await ReservationModel.findOne({
    scheduleId: new ObjectId(scheduleId),
    diningId: new ObjectId(diningId),
  });
  if (!reservation) {
    throw new AppError(404, "Reservation Not Found");
  }

  //check availableSeats
  const availableSeats = Number(reservation?.seats);
  if (availableSeats < guest) {
    throw new AppError(
      400,
      "There are no available seats at this moment or schedule"
    );
  }

  //generate token
  const token = Math.floor(100000 + Math.random() * 900000);

  //calculation of canCellationCharge
  const cancellationCharge = getPercentageValue(
    amount,
    restaurant.cancellationPercentage as number
  );

  //transaction & rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //database-process-01
    //create the booking
    const newBooking = await BookingModel.create(
      [
        {
          userId: loginUserId,
          scheduleId: reservation?.scheduleId,
          diningId,
          restaurantId: reservation?.restaurantId,
          ownerId: reservation?.ownerId,
          token,
          guest,
          amount,
          paymentStatus: "paid",
          cancellationCharge,
        },
      ],
      { session }
    );

    //   //database-process-03
    //create the payment
    const transactionId = new ObjectId().toString();
    await PaymentModel.create({
      ownerId: restaurant?.ownerId,
      restaurantId: restaurant?._id,
      bookingId: newBooking[0]?._id,
      amount,
      transactionId,
      status: "paid",
    });

    //database-process-03
    //update the reservation seats
    await ReservationModel.updateOne(
      {
        scheduleId: reservation?.scheduleId,
        restaurantId: reservation?.restaurantId,
        ownerId: reservation?.ownerId,
        seats: { $gt: 0 },
      },
      { $inc: { seats: -guest } }, // Decrease seats
      { session }
    );

    await session.commitTransaction();
    await session.endSession();
    return newBooking[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getBookingsService = async (
  loginUserId: string,
  query: TBookingQuery
) => {
  const ObjectId = Types.ObjectId;
  // 1. Extract query parameters
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortOrder = "asc",
    sortBy = "startDateTime",
    date,
    ...filters // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //4. setup searching
  let searchQuery: any = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, BookingSearchFields);
  }

  //console.dir(searchQuery, {depth:null})

  //5 setup filters
  let filterQuery = {};
  //check if only filter by date
  if (date) {
    const start = `${date}T00:00:00.000+00:00`;
    const end = `${date}T23:59:59.999+00:00`;
    filterQuery = {
      ...filterQuery,
      startDateTime: { $gte: new Date(start), $lte: new Date(end) },
    };
  }

  //add additional filters
  if (filters) {
    filterQuery = {
      ...filterQuery,
      ...makeFilterQuery(filters),
    };
  }

  //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ ownerId: loginUserId });
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  const result = await BookingModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurant._id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
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
        as: "dining",
      },
    },
    {
      $unwind: "$dining",
    },
    {
      $project: {
        _id: "$_id",
        userId: "$userId",
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone",
        customerImg: "$user.profileImg",
        token: "$token",
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name",
        amount: "$amount",
        guest: "$guest",
        cancellationCharge: "$cancellationCharge",
        status: "$status",
        paymentStatus: "$paymentStatus",
        // createdAt: "$createdAt",
        // updatedAt: "$updatedAt",
      },
    },
    {
      $match: {
        ...filterQuery,
        ...searchQuery,
      },
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    {
      $sort: { startDateTime: -1 }, //after projection
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count
  const totalBookingResult = await BookingModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurant._id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
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
        as: "dining",
      },
    },
    {
      $unwind: "$dining",
    },
    {
      $project: {
        _id: "$_id",
        userId: "$userId",
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone",
        customerImg: "$user.profileImg",
        token: "$token",
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name",
        amount: "$amount",
        guest: "$guest",
        cancellationCharge: "$cancellationCharge",
        status: "$status",
        paymentStatus: "$paymentStatus",
        // createdAt: "$createdAt",
        // updatedAt: "$updatedAt",
      },
    },
    {
      $match: {
        ...filterQuery,
        ...searchQuery,
      },
    },
    { $count: "totalCount" },
  ]);

  const totalCount = totalBookingResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

  const modifiedResult =
    result?.length > 0
      ? result?.map((booking) => ({
          _id: booking?._id,
          userId: booking?.userId,
          customerName: booking?.customerName,
          customerEmail: booking?.customerEmail,
          customerPhone: booking?.customerPhone,
          customerImg: booking?.customerImg,
          diningName: booking?.diningName,
          token: booking?.token,
          amount: booking?.amount,
          guest: booking?.guest,
          cancellationCharge: booking?.cancellationCharge,
          paymentStatus: booking?.paymentStatus,
          date: booking?.date,
          time:
            convertUTCtimeString(booking.startDateTime) +
            " - " +
            convertUTCtimeString(booking.endDateTime),
        }))
      : [];

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

const getMyBookingsService = async (
  loginUserId: string,
  query: TBookingQuery
) => {
  const ObjectId = Types.ObjectId;
  // 1. Extract query parameters
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortOrder = "asc",
    sortBy = "startDateTime",
    date,
    ...filters // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //4. setup searching
  let searchQuery: any = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, MyBookingSearchFields);
  }

  //console.dir(searchQuery, {depth:null})

  //5 setup filters
  let filterQuery = {};
  //add additional filters
  if (filters) {
    filterQuery = {
      ...filterQuery,
      ...makeFilterQuery(filters),
    };
  }

  const result = await BookingModel.aggregate([
    {
      $match: { userId: new ObjectId(loginUserId) },
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurantId",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant",
    },
    {
      $match: {
        ...filterQuery,
        ...searchQuery,
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
        as: "dining",
      },
    },
    {
      $unwind: "$dining",
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "bookingId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: "$_id",
        restaurantId: "$restaurant._id",
        restaurantName: "$restaurant.name",
        restaurantImg: "$restaurant.restaurantImg",
        restaurantAddress: "$restaurant.address",
        token: "$token",
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name",
        amount: "$amount",
        guest: "$guest",
        cancellationCharge: "$cancellationCharge",
        status: "$status",
        paymentStatus: "$paymentStatus",
        totalReview: "$totalReview",
        createdAt: 1,
      },
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    {
      $sort: { createdAt: -1, date: -1 }, //after projection
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  const modifiedResult =
    result?.length > 0
      ? result?.map((booking) => ({
          _id: booking?._id,
          userId: booking?.userId,
          restaurantId: booking?.restaurantId,
          restaurantName: booking?.restaurantName,
          restaurantImg: booking?.restaurantImg,
          restaurantAddress: booking?.restaurantAddress,
          diningName: booking?.diningName,
          token: booking?.token,
          amount: booking?.amount,
          guest: booking?.guest,
          cancellationCharge: booking?.cancellationCharge,
          paymentStatus: booking?.paymentStatus,
          status: booking?.status,
          date: booking?.date,
          time:
            convertUTCtimeString(booking.startDateTime) +
            " - " +
            convertUTCtimeString(booking.endDateTime),
          review: booking?.totalReview === 1 ? true : false,
        }))
      : [];

  // total count
  const totalBookingResult = await BookingModel.aggregate([
    {
      $match: { userId: new ObjectId(loginUserId) },
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurantId",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant",
    },
    {
      $match: {
        ...filterQuery,
        ...searchQuery,
      },
    },
    { $count: "totalCount" },
  ]);

  const totalCount = totalBookingResult[0]?.totalCount || 0;
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

const updateBookingStatusService = async (
  loginUserId: string,
  bookingId: string,
  status: TBookingStatus
) => {

  const booking = await BookingModel.findOne({
    _id: bookingId,
    ownerId: loginUserId,
  });

  if (!booking) {
    throw new AppError(404, "Booking Not Found");
  }

  const result = await BookingModel.updateOne(
    {
      _id: bookingId,
      ownerId: loginUserId,
    },
    { status }
  );

  return result;
};

const getSingleBookingService = async (
  loginUserId: string,
  bookingId: string
) => {
  const booking = await BookingModel.aggregate([
    {
      $match: {
        _id: new ObjectId(bookingId),
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
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
        as: "dining",
      },
    },
    {
      $unwind: "$dining",
    },
    {
      $lookup: {
        from: "tablebookings",
        localField: "_id",
        foreignField: "bookingId",
        as: "tableBooking",
      },
    },
    {
      $addFields: {
        tableBookedGuests: {
          $sum: {
            $map: {
              input: "$tableBooking",
              as: "tb",
              in: "$$tb.guest",
            },
          },
        },
      },
    },

    {
      $project: {
        _id: 1,
        userId: 1,
        restaurantId: 1,
        ownerId: 1,
        scheduleId: 1,
        diningId: 1,
        diningName: "$dining.name",
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        token: 1,
        amount: 1,
        guest: 1,
        cancellationCharge: 1,
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone",
        tableBookedGuests: 1,
      },
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
  ]);

  if (booking?.length === 0) {
    throw new AppError(404, "Booking Not Found");
  }

  const { startDateTime, guest, tableBookedGuests, endDateTime, ...rest } =
    booking[0];

  const modifiedResult = {
    ...rest,
    guest,
    tableBookedGuests,
    remainingBookedGuests: Number(guest - tableBookedGuests),
    time:
      convertUTCtimeString(startDateTime) +
      " - " +
      convertUTCtimeString(endDateTime),
  };

  return modifiedResult;
};

export {
  createBookingWithoutPaymentService,
  createBookingWithPaymentService,
  getBookingsService,
  getMyBookingsService,
  updateBookingStatusService,
  getSingleBookingService,
};
