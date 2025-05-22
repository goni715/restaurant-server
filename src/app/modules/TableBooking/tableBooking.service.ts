import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import TableModel from "../Table/table.model";
import { ITableBooking, TTableBookingQuery } from "./tableBooking.interface";
import TableBookingModel from "./tableBooking.model";
import BookingModel from "../Booking/booking.model";
import { makeSearchQuery } from "../../helper/QueryBuilder";
import { TableBookingSearchFields } from "./tableBooking.constant";
import RestaurantModel from "../Restaurant/restaurant.model";
import ObjectId from "../../utils/ObjectId";
import convertUTCtimeString from "../../utils/convertUTCtimeString";

const createTableBookingService = async (
  loginUserId: string,
  payload: ITableBooking
) => {
  const { bookingId, tableId, guest } = payload;
  const table = await TableModel.findOne({
    _id: tableId,
    ownerId: loginUserId,
  });

  if (!table) {
    throw new AppError(404, "Table Not found");
  }

  //check booking
  const booking = await BookingModel.findOne({
    _id: bookingId,
    ownerId: loginUserId,
  });
  if (!booking) {
    throw new AppError(404, "Booking Not Found");
  }

  // //check availableSeats
  const availableSeats = table.seats;
  if (availableSeats < guest) {
    throw new AppError(
      404,
      "There are no available seats in this table at this moment"
    );
  }

  //checked alreadyBooked Seats
  const tableBooking = await TableBookingModel.aggregate([
    {
      $match: {
        bookingId: new ObjectId(bookingId),
      },
    },
    {
      $group: {
        _id: new ObjectId(bookingId),
        totalBookedSeats: {
          $sum: "$guest",
        },
      },
    },
  ]);

  const alreadyTableBookedSeats =
    tableBooking?.length > 0 ? tableBooking[0].totalBookedSeats : 0;
  const dueBookingSeats = Number(booking.guest - alreadyTableBookedSeats);
  if (alreadyTableBookedSeats === booking.guest) {
    throw new AppError(409, "You have already booked your seats on the table");
  }

  if (guest > dueBookingSeats) {
    throw new AppError(
      409,
      `You will be able to book only ${dueBookingSeats} seat(s)`
    );
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
          guest,
        },
      ],
      { session }
    );

    //check again
    const tableBooked = await TableBookingModel.aggregate(
      [
        {
          $match: {
            bookingId: new ObjectId(bookingId),
          },
        },
        {
          $group: {
            _id: new ObjectId(bookingId),
            totalBookedSeats: {
              $sum: "$guest",
            },
          },
        },
      ],
      { session }
    );

    const alreadyBookedSeats =
      tableBooked?.length > 0 ? tableBooked[0].totalBookedSeats : 0;
    if (alreadyBookedSeats === booking.guest) {
      //database-process-02
      //update the table
      await BookingModel.updateOne(
        { _id: bookingId },
        { status: "seating" },
        { runValidators: true, session }
      );
    }

    //database-process-03
    //update the table
    await TableModel.updateOne(
      { _id: tableId, seats: { $gt: 0 } },
      { $inc: { seats: -guest } }, // Decrease availableSeats
      { runValidators: true, session }
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

const getTableBookingsService = async (
  loginUserId: string,
  query: TTableBookingQuery
) => {
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
  //const sortDirection = sortOrder === "asc" ? 1 : -1;

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
      startDateTime: { $gte: new Date(start), $lte: new Date(end) },
    };
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
      },
    },
    {
      $group: {
        _id: "$bookingId",
        bookedSeats: {
           $sum: "$guest"
        }
      }
    },
    {
      $lookup: {
        from: "bookings",
        localField: "_id", //This is bookingId
        foreignField: "_id",
        as: "booking",
      },
    },
    {
      $unwind: "$booking",
    },
    {
      $project: {
        _id:0,
        bookingId:"$_id",
        bookedSeats:1,
        userId: "$booking.userId",
        scheduleId: "$booking.scheduleId",
        diningId: "$booking.diningId",
        token: "$booking.token"
      }
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
        as: "dining"
      }
    },
    {
      $unwind: "$dining"
    },
    {
      $project: {
        bookingId: 1,
        token:1,
        bookedSeats:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        diningName: "$dining.name",
        startDateTime: "$schedule.startDateTime",
        endDateTime: "$schedule.startDateTime",
      }
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
    {
      $match: {
        ...filterQuery,
        ...searchQuery,
      },
    },
    {
      $sort: { startDateTime: -1 }, //after projection
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);


  //modify the result
   const modifiedResult =
     result?.length > 0
       ? result?.map((tablebooking) => ({
           bookingId: tablebooking?.bookingId,
           token: tablebooking?.token,
           bookedSeats: tablebooking?.bookedSeats,
           fullName: tablebooking?.fullName,
           email: tablebooking?.email,
           phone: tablebooking?.phone,
           date: tablebooking?.date,
           diningName: tablebooking?.diningName,
           time:
             convertUTCtimeString(tablebooking?.startDateTime) +
             " - " +
             convertUTCtimeString(tablebooking?.endDateTime),
         }))
       : [];


  // total count
  const totalBookingResult = await TableBookingModel.aggregate([
    {
      $match: {
        restaurantId: new ObjectId(restaurant._id),
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $group: {
        _id: "$bookingId",
        bookedSeats: {
           $sum: "$guest"
        }
      }
    },
    {
      $lookup: {
        from: "bookings",
        localField: "_id", //This is bookingId
        foreignField: "_id",
        as: "booking",
      },
    },
    {
      $unwind: "$booking",
    },
    {
      $project: {
        _id:0,
        bookingId:"$_id",
        bookedSeats:1,
        userId: "$booking.userId",
        scheduleId: "$booking.scheduleId",
        token: "$booking.token"
      }
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
        bookingId: 1,
        token:1,
        bookedSeats:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        startDateTime: "$schedule.startDateTime",
      }
    },
    {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
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

const getTableBookingsByBookingIdService = async (
  loginUserId: string,
  bookingId: string
) => {
 
  //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ ownerId: loginUserId });
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  //check booking
  const booking = await BookingModel.aggregate([
  { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
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
      bookingId:"$_id",
      token:1,
      _id:0,
      customerName: "$user.fullName",
      customerEmail: "$user.email",
      customerPhone: "$user.phone",
      customerImg: "$user.profileImg",
      diningName: "$dining.name",
      startDateTime: "$schedule.startDateTime",
      endDateTime: "$schedule.endDateTime",
    }
  },
   {
      $addFields: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime" } },
      },
    },
]);

 if (booking?.length === 0) {
    throw new AppError(404, "Booking not found");
 }

   const result = await TableBookingModel.aggregate([
    {
      $match: {
        restaurantId: new ObjectId(restaurant._id),
        ownerId: new ObjectId(loginUserId),
        bookingId: new ObjectId(bookingId),
      },
    },
    {
      $group: {
        _id: "$tableId",
        bookedSeats: {
          $sum: "$guest"
        }
      }
    },
    {
      $lookup: {
        from: "tables",
        localField: "_id", //tableId
        foreignField: "_id",
        as: "table",
      },
    },
    {
      $unwind: "$table",
    },
    {
      $project: {
        _id:0,
        bookedSeats:1,
        tableName: "$table.name"
      }
    },
    {
      $facet: {
        tableData: [
         {
           $project: {bookedSeats:1, tableName:1}
         },
         {
          $addFields: {
            tableNumber: {
            $toInt:  {
              $arrayElemAt: [
                { $split: ["$tableName", "-"]}, 1
              ]
            }
          }
          }
         },{
          $sort:{
            tableNumber:1
          }
         }
        ],
        totalBookedSeats: [
          {
            $group: {
              _id:null,
              total: {
                $sum: "$bookedSeats"
              }
            }
          }
        ]
      }
    }
  ]);


  return {
    ...booking[0],
    time:
      convertUTCtimeString(booking[0]?.startDateTime) +
      " - " +
      convertUTCtimeString(booking[0]?.endDateTime),
    tableData: result[0].tableData,
    totalBookedSeats: result[0].totalBookedSeats[0]?.total || 0
  };
};

const changeAvailabilityService = async (
  loginUserId: string,
  tableBookingId: string,
  payload: { availability: "Seating" | "Waitlist" }
) => {
  const tableBooking = await TableBookingModel.findOne({
    _id: tableBookingId,
    ownerId: loginUserId,
  });
  if (!tableBooking) {
    throw new AppError(404, "Table Booking Not Found");
  }

  const result = await TableBookingModel.updateOne(
    { _id: new ObjectId(tableBookingId), ownerId: loginUserId },
    payload
  );

  return result;
};

const deleteTableBookingService = async (
  loginUserId: string,
  tableBookingId: string
) => {
  const tableBooking = await TableBookingModel.findOne({
    _id: tableBookingId,
    ownerId: loginUserId,
  });
  if (!tableBooking) {
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
      { $inc: { seats: +3 } }, // Increase availableSeats
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
};

export {
  createTableBookingService,
  getTableBookingsService,
  getTableBookingsByBookingIdService,
  changeAvailabilityService,
  deleteTableBookingService,
};
