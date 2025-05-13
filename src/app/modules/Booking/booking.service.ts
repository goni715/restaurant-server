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

const createBookingWithoutPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { reservationId, guest } = payload;
  const reservation = await ReservationModel.findById(reservationId);

  if (!reservation) {
    throw new AppError(404, "Reservation not found");
  }
  
 //check availableSeats
  const availableSeats = Number(reservation?.seats);
  if(availableSeats < guest) {
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
  try{
    session.startTransaction();

    //database-process-01
    //create the booking
    const newBooking = await BookingModel.create([{
    userId: loginUserId,
    scheduleId: reservation?.scheduleId,
    restaurantId: reservation?.restaurantId,
    ownerId: reservation?.ownerId,
    token,
    guest
    }], { session });

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
  }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
  }
};

const createBookingWithPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  // const { restaurantId, diningId, guest, date, checkIn, checkOut } = payload;

  // const dining = await DiningModel.findById(diningId);
  // if (!dining) {
  //   throw new AppError(404, "This dining not found");
  // }

  // const restaurant = await RestaurantModel.findById(restaurantId);
  // if (!restaurant) {
  //   throw new AppError(404, "Restaurant Not Found");
  // }

  // // const date = `${date}T00:00:00.000+00:00`;
  // //generate token
  // const token = Math.floor(1000 + Math.random() * 900000);

  // const currentDay = new Date("2025-01-01T00:00:00.000Z");

  // // Parse start and end time as UTC
  // const [startHour, startMinute] = checkIn.split(":").map(Number);
  // const startDateTime = new Date(
  //   Date.UTC(
  //     currentDay.getUTCFullYear(),
  //     currentDay.getUTCMonth(),
  //     currentDay.getUTCDate(),
  //     startHour,
  //     startMinute,
  //     0
  //   )
  // ); //month is 0-based

  // const [endHour, endMinute] = checkOut.split(":").map(Number);
  // const endDateTime = new Date(
  //   Date.UTC(
  //     currentDay.getUTCFullYear(),
  //     currentDay.getUTCMonth(),
  //     currentDay.getUTCDate(),
  //     endHour,
  //     endMinute,
  //     0
  //   )
  // ); //month is 0-based

  // //create the booking
  // const result = await BookingModel.create({
  //   userId: loginUserId,
  //   restaurantId: restaurantId,
  //   diningId,
  //   token,
  //   guest,
  //   date: new Date(date),
  //   checkIn,
  //   checkOut,
  //   startDateTime,
  //   endDateTime,
  // });

  return "result";
};

// const createBookingWithService = async (
//   loginUserId: string,
//   payload: IBookingPayload
// ) => {
//   const { diningId, amount, guest } = payload;
//    const ObjectId = Types.ObjectId;

//    const dining = await DiningModel.findById(diningId);
//    if(!dining){
//        throw new AppError(404, 'This dining not found');
//    }

//   }

//   //calculation of canCellationCharge
//   const cancellationCharge = getPercentageValue(amount, restaurant.cancellationPercentage as number)

  // const session = await mongoose.startSession();
  // try{
  //   session.startTransaction();

  //   //database-process-01
  //   //create the booking
  //   const newBooking = await BookingModel.create([{
  //       userId: loginUserId,
  //       scheduleId,
  //       restaurantId: schedule.restaurantId,
  //       diningId,
  //       amount,
  //       cancellationCharge,
  //       guest,
  //   }], { session });

  //   //database-process-02
  //   //update the schedule
  //   await ScheduleModel.updateOne(
  //       { _id: scheduleId, availableSeats: { $gt: 0 }},
  //       { $inc: { availableSeats: - guest } }, // Decrease availableSeats
  //       { session }
  //   )

  //   //database-process-03
  //   //create the payment
  //   const transactionId = new ObjectId().toString();
  //   await PaymentModel.create({
  //       bookingId: newBooking[0]?._id,
  //       amount,
  //       transactionId
  //   })

  //   await session.commitTransaction();
  //   await session.endSession();
  //   return newBooking[0];
  // }catch(err:any){
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw new Error(err)
  //}
// };

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
      date: { $gte: new Date(start), $lte: new Date(end) },
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
        as: "schedule"
      }
    },
    {
      $unwind: "$schedule"
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
      $project: {
        _id: "$_id",
        userId: "$userId",
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone", 
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
         amount: "$amount",
        guest: "$guest",
        cancellationCharge: "$cancellationCharge",
        status: "$status",
        paymentStatus: "$paymentStatus",
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
           userId: booking?.userId,
           customerName: booking?.customerName,
           customerEmail: booking?.customerEmail,
           customerPhone: booking?.customerPhone,
           customerImg: booking?.customerImg,
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
      $project: {
        _id: "$_id",
        restaurantName: "$restaurant.name",
        token: "$token",
        startDateTime: "$startDateTime",
        endDateTime: "$endDateTime",
        amount: "$amount",
        guest: "$guest",
        cancellationCharge: "$cancellationCharge",
        status: "$status",
        paymentStatus: "$paymentStatus",
      },
    },
    {
      $sort: { date: -1 }, //after projection
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

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
    data: result,
  };
};

const updateBookingStatusService = async (
  loginUserId: string,
  bookingId: string,
  status: TBookingStatus
) => {
  console.log({
    loginUserId,
    bookingId,
  });

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
      $project: {
        _id: 1,
        userId: 1,
        restaurantId: 1,
        ownerId: 1,
        scheduleId:1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        token: 1,
        amount: 1,
        guest: 1,
        cancellationCharge: 1,
        status: 1,
        //paymentStatus: 1,
        //createdAt: 1,
        //updatedAt: 1,
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone",
      },
    },
  ]);

  if (booking?.length === 0) {
    throw new AppError(404, "Booking Not Found");
  }

  return booking[0];
};

export {
  createBookingWithoutPaymentService,
  createBookingWithPaymentService,
  getBookingsService,
  getMyBookingsService,
  updateBookingStatusService,
  getSingleBookingService,
};
