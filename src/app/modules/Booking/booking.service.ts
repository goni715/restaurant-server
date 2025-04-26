import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import ScheduleModel from "../Schedule/schedule.model";
import { IBookingPayload, TBookingQuery } from "./booking.interface"
import BookingModel from "./booking.model";
import PaymentModel from "../Payment/payment.model";
import DiningModel from "../Dining/dining.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import getPercentageValue from "../../utils/getPercentageValue";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { BookingSearchFields } from "./booking.constant";


const createBookingWithoutPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { restaurantId, diningId, guest,date, checkIn, checkOut } = payload;

  const dining = await DiningModel.findById(diningId);
  if (!dining) {
    throw new AppError(404, "This dining not found");
  }

  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  // const date = `${date}T00:00:00.000+00:00`;
  //generate token
  const token = Math.floor(1000 + Math.random() * 900000);

  const currentDay = new Date("2025-01-01T00:00:00.000Z");

  // Parse start and end time as UTC
  const [startHour, startMinute] = checkIn.split(":").map(Number);
  const startDateTime = new Date(
    Date.UTC(
      currentDay.getUTCFullYear(),
      currentDay.getUTCMonth(),
      currentDay.getUTCDate(),
      startHour,
      startMinute,
      0
    )
  ); //month is 0-based

  const [endHour, endMinute] = checkOut.split(":").map(Number);
  const endDateTime = new Date(
    Date.UTC(
      currentDay.getUTCFullYear(),
      currentDay.getUTCMonth(),
      currentDay.getUTCDate(),
      endHour,
      endMinute,
      0
    )
  ); //month is 0-based

  //create the booking
  const result = await BookingModel.create({
    userId: loginUserId,
    restaurantId: restaurantId,
    diningId,
    token,
    guest,
    date: new Date(date),
    checkIn,
    checkOut,
    startDateTime,
    endDateTime
  });

  return result;
};



const createBookingWithPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { restaurantId, diningId, guest,date, checkIn, checkOut } = payload;

  const dining = await DiningModel.findById(diningId);
  if (!dining) {
    throw new AppError(404, "This dining not found");
  }

  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  // const date = `${date}T00:00:00.000+00:00`;
  //generate token
  const token = Math.floor(1000 + Math.random() * 900000);

  const currentDay = new Date("2025-01-01T00:00:00.000Z");

  // Parse start and end time as UTC
  const [startHour, startMinute] = checkIn.split(":").map(Number);
  const startDateTime = new Date(
    Date.UTC(
      currentDay.getUTCFullYear(),
      currentDay.getUTCMonth(),
      currentDay.getUTCDate(),
      startHour,
      startMinute,
      0
    )
  ); //month is 0-based

  const [endHour, endMinute] = checkOut.split(":").map(Number);
  const endDateTime = new Date(
    Date.UTC(
      currentDay.getUTCFullYear(),
      currentDay.getUTCMonth(),
      currentDay.getUTCDate(),
      endHour,
      endMinute,
      0
    )
  ); //month is 0-based

  //create the booking
  const result = await BookingModel.create({
    userId: loginUserId,
    restaurantId: restaurantId,
    diningId,
    token,
    guest,
    date: new Date(date),
    checkIn,
    checkOut,
    startDateTime,
    endDateTime
  });

  return result;
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


//   const session = await mongoose.startSession();
//   try{
//     session.startTransaction();

//     //database-process-01
//     //create the booking
//     const newBooking = await BookingModel.create([{
//         userId: loginUserId,
//         scheduleId,
//         restaurantId: schedule.restaurantId,
//         diningId,
//         amount,
//         cancellationCharge,
//         guest,
//     }], { session });


//     //database-process-02
//     //update the schedule
//     await ScheduleModel.updateOne(
//         { _id: scheduleId, availableSeats: { $gt: 0 }},
//         { $inc: { availableSeats: - guest } }, // Decrease availableSeats
//         { session }
//     )

    
//     //database-process-03
//     //create the payment
//     const transactionId = new ObjectId().toString();
//     await PaymentModel.create({
//         bookingId: newBooking[0]?._id,
//         amount,
//         transactionId
//     })


//     await session.commitTransaction();
//     await session.endSession();
//     return newBooking[0];
//   }catch(err:any){
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error(err)
//   }
// };


const getBookingsService = async (loginUserId:string, query: TBookingQuery) => {
  console.log(loginUserId);
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
  
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

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
           "schedule.startDateTime": { $gte: new Date(start), $lte: new Date(end) }
         };
      }

    //add additional filters
    if (filters) {
      filterQuery = {
        ...filterQuery,
        ...makeFilterQuery(filters)
      }
    }

  //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ ownerId: loginUserId });
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }


  const result = await BookingModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurant._id)}
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
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
      $match: {
         ...filterQuery,
         ...searchQuery
      }
    },
    {
      $project: {
        _id:"$_id",
        userId: "$userId",
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone",
        scheduleId: "$scheduleId",
        date: "$date",
        checkIn: "$checkIn",
        checkOuT: "$checkOut",
        token: "$token",
        startDateTime: "$startDateTime",
        endDateTime: "$endDateTime",
        amount:"$amount",
        guest:"$guest",
        cancellationCharge: "$cancellationCharge",
        status: "$status",
        paymentStatus: "$paymentStatus",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt"
      }
    },
    {
      $sort: {date: -1}, //after projection
    },
    { $skip: skip },
    { $limit: Number(limit) }
  ])

  
   // total count 
const totalBookingResult = await BookingModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurant._id)}
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
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
      $match: {
         ...filterQuery,
         ...searchQuery
      }
    },
     { $count: "totalCount" }
  ])

  const totalCount = totalBookingResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));
  
 return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result
 }



}

export { createBookingWithoutPaymentService, createBookingWithPaymentService, getBookingsService };