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
    const {name, token, tableId, guest, availability } = payload;
    const table = await TableModel.findOne({
        _id: tableId,
        ownerId: loginUserId
    })

    if(!table){
        throw new AppError(404, "Table Not found");
    }

    //check token is not valid
    const tokenExist = await BookingModel.findOne({ token });
    if(!tokenExist){
        throw new AppError(400, "Invaild Token");
    }
    //check availableSeats
   const availableSeats = table.seats;
   if(availableSeats < guest){
     throw new AppError(400, "There are no available seats in this table at this moment")
   }


   //transaction & rollback part
   const session = await mongoose.startSession();
   
   try{
    session.startTransaction();

    //database-process-01
    //create the tableBooking
    const newBooking = await TableBookingModel.create([{
        name,
        token,
        guest,
        tableId,
        scheduleId: table.scheduleId,
        ownerId: table.ownerId,
        restaurantId: table.restaurantId,
        diningId: table.diningId,
        availability
    }], { session });


    //database-process-02
    //update the table
    await TableModel.updateOne(
        { _id: tableId, seats: { $gt: 0 }},
        { $inc: { seats: - guest } }, // Decrease availableSeats
        { session }
    )

    
    await session.commitTransaction();
    await session.endSession();
    return newBooking[0];
   }
   catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
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
    $project: {
        name: "$name",
        token: 1,
        guest:1,
        availability:1,
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.endDateTime",
        diningName: "$dining.name",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt" 
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

 const result = await TableBookingModel.deleteOne({
  _id: tableBookingId,
  ownerId: loginUserId
 })
 return result;
}

export {
    createTableBookingService,
    getTableBookingsService,
    changeAvailabilityService,
    deleteTableBookingService 
}