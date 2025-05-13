import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import TableModel from "../Table/table.model"
import { ITableBooking, TTableBookingQuery } from "./tableBooking.interface"
import TableBookingModel from "./tableBooking.model"
import BookingModel from "../Booking/booking.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { TableBookingSearchFields } from "./tableBooking.constant";
import RestaurantModel from "../Restaurant/restaurant.model";
import ObjectId from "../../utils/ObjectId";


const createTableBookingService = async (loginUserId:string, payload: ITableBooking) => {
  const { bookingId, tableId } = payload;
  const table = await TableModel.findOne({
    _id: tableId,
    ownerId: loginUserId,
  });

  if (!table) {
    throw new AppError(404, "Table Not found");
  }

  //check booking
  const booking = await BookingModel.findOne({ _id:bookingId, ownerId:loginUserId });
  if (!booking) {
    throw new AppError(404, "Booking Not Found");
  }

  const bookingGuest = booking.guest;
 
  //check availableSeats
  const availableSeats = table.seats;
  if (availableSeats < bookingGuest) {
    throw new AppError(
      400,
      "There are no available seats in this table at this moment"
    );
  }


  //check already booked table
  const tableBooking = await TableBookingModel.findOne({
    bookingId
  })
  if(tableBooking){
    throw new AppError(409, "Already booked the table")
  }


  //transaction & rollback part
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //database-process-01
    //create the tableBooking
    const newBooking = await TableBookingModel.create(
      [
        {
          bookingId,
          userId: booking.userId,
          tableId,
          scheduleId: table.scheduleId,
          ownerId: table.ownerId,
          restaurantId: table.restaurantId,
          diningId: table.diningId,
        },
      ],
      { session }
    );


     //database-process-02
    //update the table
    await BookingModel.updateOne(
      { _id: bookingId },
      { status: "seating" }, 
      { runValidators:true, session }
    );

    //database-process-03
    //update the table
    await TableModel.updateOne(
      { _id: tableId, seats: { $gt: 0 } },
      { $inc: { seats: -bookingGuest } }, // Decrease availableSeats
      { runValidators:true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return newBooking[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
}

const getTableBookingsService = async (loginUserId: string, query: TTableBookingQuery) => {
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
       searchQuery = makeSearchQuery(searchTerm, TableBookingSearchFields);
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


 const result = await TableBookingModel.aggregate([
   {
     $match: {
         restaurantId: new ObjectId(restaurant._id),
         ownerId: new ObjectId(loginUserId),
         ...filterQuery,
         ...searchQuery
     }
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
    $lookup: {
      from: "tables",
      localField: "tableId",
      foreignField: "_id",
      as: "table"
    }
  },
  {
    $unwind: "$table"
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
      from: "bookings",
      localField: "bookingId",
      foreignField: "_id",
      as: "booking"
    }
  },
  {
    $unwind: "$booking"
  },
  {
    $project: {
        bookingId:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        token: "$booking.token",
        guest: "$booking.guest"
    }
  },
   {
     $sort: { createdAt : 1}, //after projection
   },
   { $skip: skip },
   { $limit: Number(limit) }
 ])

 
  // total count 
const totalBookingResult = await TableBookingModel.aggregate([
    {
        $match: {
            restaurantId: new ObjectId(restaurant._id),
            ownerId: new ObjectId(loginUserId),
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


const changeAvailabilityService = async (loginUserId: string, tableBookingId:string, payload: { availability: "Seating" | "Waitlist" }) => {

  const tableBooking = await TableBookingModel.findOne({
    _id: tableBookingId,
    ownerId: loginUserId
  });
  if(!tableBooking){
    throw new AppError(404, "Table Booking Not Found");
  }

   const result = await TableBookingModel.updateOne(
    { _id: new ObjectId(tableBookingId), ownerId: loginUserId },
    payload
   );

   return result;
}

const deleteTableBookingService = async (loginUserId: string, tableBookingId: string) => {
  const tableBooking = await TableBookingModel.findOne({
    _id: tableBookingId,
    ownerId: loginUserId
  });
  if(!tableBooking){
    throw new AppError(404, "Table Booking Not Found");
  }


//transaction & rollback part
const session = await mongoose.startSession();

try {
  session.startTransaction();

  //database-process-01
  //update the table seats
  await TableModel.updateOne(
    { _id: tableBooking.tableId, seats: { $gt: 0 } },
    { $inc: { seats: + 3 } }, // Increase availableSeats
    { session }
  );

  //database-process-02
  //delete the tableBooking
  const result = await TableBookingModel.deleteOne(
    {
      _id: tableBookingId,
      ownerId: loginUserId,
    },
    { session }
  );

  await session.commitTransaction();
  await session.endSession();
  return result;
} catch (err: any) {
  await session.abortTransaction();
  await session.endSession();
  throw new Error(err);
}

}

export {
    createTableBookingService,
    getTableBookingsService,
    changeAvailabilityService,
    deleteTableBookingService 
}