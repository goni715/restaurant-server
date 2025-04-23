import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import RestaurantModel from "../Restaurant/restaurant.model";
import { TSchedulePayload, TScheduleQuery, TUserScheduleQuery } from "./schedule.interface"
import ScheduleModel from "./schedule.model";
import BookingModel from "../Booking/booking.model";
import isDifferenceDuration from "../../utils/isDifferenceDuration";
import TableModel from "../Table/table.model";


const createScheduleService = async (loginUserId: string, payload: TSchedulePayload) => {
    const {startDate, endDate, slot, availableSeats, bookingFee, availability, paymentRequired } = payload;
    //check restaurant not found
    const restaurant = await RestaurantModel.findOne({
        ownerId: loginUserId
      });
      if (!restaurant) {
        throw new AppError(404, "Restaurant not found");
      }


    // schedule creation part

    const schedules:any[] = [];
    //duration = const timeSlotMinutes = 30; // Schedule interval = unit = minutes

    // Convert start and end date to UTC
    const startDateObj = new Date(`${startDate}T00:00:00.000Z`);
    const endDateObj = new Date(`${endDate}T00:00:00.000Z`);



    for (let currentDate = new Date(startDateObj); currentDate <= endDateObj; currentDate.setUTCDate(currentDate.getUTCDate() + 1)) {
        let currentDay = new Date(currentDate);

      
         for(let i=0; i < slot.length; i++){
          const { startTime, endTime} = slot[i];
          const [startHour, startMinute] = startTime.split(":").map(Number);
          let startDateTime = new Date(
            Date.UTC(
              currentDay.getUTCFullYear(),
              currentDay.getUTCMonth(),
              currentDay.getUTCDate(),
              startHour,
              startMinute,
              0
            )
          );

          const [endHour, endMinute] = endTime.split(":").map(Number);
          let endDateTime = new Date(
            Date.UTC(
              currentDay.getUTCFullYear(),
              currentDay.getUTCMonth(),
              currentDay.getUTCDate(),
              endHour,
              endMinute,
              0
            )
          );


          const scheduleData = {
            ownerId: loginUserId,
            restaurantId: restaurant._id,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
          };

          //check if schedule exist
          const existingSchedule = await ScheduleModel.findOne(scheduleData);

          if(!existingSchedule){
              schedules.push({
                ...scheduleData,
                availableSeats,
                bookingFee,
                availability,
                paymentRequired
              })
          }
         }
        
       
    }

    const result = await ScheduleModel.insertMany(schedules);
    return result
}

const getSchedulesService =  async (loginUserId: string, query:TScheduleQuery) => {
    const ObjectId = Types.ObjectId;
     // 1. Extract query parameters
      const {
        page = 1, 
        limit = 10, 
        sortOrder = "asc",
        sortBy = "startDateTime", 
        date,
        startDate,
        endDate
        //...filters // Any additional filters
      } = query;
    
    
      // 2. Set up pagination
      const skip = (Number(page) - 1) * Number(limit);
    
      //3. setup sorting
      const sortDirection = sortOrder === "asc" ? 1 : -1;
   
      
        //4 setup filters
        let filterQuery = {};
        //check if only filter by date
        if (date && !startDate && !endDate) {
          const start = `${date}T00:00:00.000+00:00`;
            const end = `${date}T23:59:59.999+00:00`;
           filterQuery = {
             startDateTime: { $gte: new Date(start), $lte: new Date(end) },
           };
        }

        //check if startDate & endDate exist
        if (startDate && endDate) {
            const start = `${startDate}T00:00:00.000+00:00`;
            const end = `${endDate}T23:59:59.999+00:00`;
           filterQuery = {
             startDateTime: { $gte: new Date(start) },
             endDateTime: { $lte: new Date(end) },
           };
        }

    //check restaurant not found
    const restaurant = await RestaurantModel.findOne({
      ownerId: loginUserId,
    });
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found");
    }


    const result = await ScheduleModel.aggregate([
        {
            $match: {
                restaurantId: new ObjectId(restaurant._id),
                ...filterQuery
            }
        },
        { $sort: { [sortBy]: sortDirection, endDateTime:1 } },
        { $skip: skip },
        { $limit: Number(limit) }
    ])

     // total count of matching users 
  const totalReviewResult = await ScheduleModel.aggregate([
    {
      $match: {
         restaurantId: new ObjectId(restaurant._id),
         ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
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
}


const getScheduleDropDownService = async (
  loginUserId: string,
  query: { date?: string }
) => {
  const ObjectId = Types.ObjectId;
  // 1. Extract query parameters
  const { date } = query;

  //4 setup filters
  let filterQuery = {};
  //check if only filter by date
  if (date) {
    const start = `${date}T00:00:00.000+00:00`;
    const end = `${date}T23:59:59.999+00:00`;
    filterQuery = {
      startDateTime: { $gte: new Date(start), $lte: new Date(end) },
    };
  }

  //check restaurant not found
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId,
  });
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  const result = await ScheduleModel.aggregate([
    {
      $match: {
        restaurantId: new ObjectId(restaurant._id),
        ...filterQuery,
      },
    },
    {
      $project: {
        _id:1,
        startDateTime:1,
        endDateTime:1
      }
    },
    { $sort: { startDateTime: 1, endDateTime: 1 } },
  ]);

  return result;
};


const getUserSchedulesService =  async (restaurantId: string, query:TUserScheduleQuery) => {
  const ObjectId = Types.ObjectId;
   // 1. Extract query parameters
    const {
      page = 1, 
      limit = 10, 
      sortOrder = "asc",
      sortBy = "startDateTime", 
      date
      //...filters // Any additional filters
    } = query;
  
  
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
  
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
 
    
      //4 setup filters
      let filterQuery = {};
      //check if only filter by date
      if (date) {
        const start = `${date}T00:00:00.000+00:00`;
          const end = `${date}T23:59:59.999+00:00`;
         filterQuery = {
           startDateTime: { $gte: new Date(start), $lte: new Date(end) }
         };
      }


  //check restaurant not found
  const restaurant = await RestaurantModel.findOne({
    _id: restaurantId,
  });
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }


  const result = await ScheduleModel.aggregate([
      {
          $match: {
              restaurantId: new ObjectId(restaurant._id),
              ...filterQuery
          }
      },
      { $sort: { [sortBy]: sortDirection, endDateTime:1 } },
      { $skip: skip },
      { $limit: Number(limit) }
  ])

   // total count of matching users 
const totalReviewResult = await ScheduleModel.aggregate([
  {
    $match: {
       restaurantId: new ObjectId(restaurant._id),
       ...filterQuery
    }
  },
  { $count: "totalCount" }
])

const totalCount = totalReviewResult[0]?.totalCount || 0;
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
}


const getSingleScheduleService = async (scheduleId: string) => {
  const schedule = await ScheduleModel.findById(scheduleId);
  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }
  return schedule;
}


const deleteScheduleService = async (loginUserId: string, scheduleId: string) => {
 
  //check schedule not found
  const schedule = await ScheduleModel.findOne({ _id: scheduleId, ownerId: loginUserId });
  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

 //check if scheduleId is associated with booking
  const associateWithBooking = await BookingModel.findOne({ scheduleId });
  if(associateWithBooking){
      throw new AppError(409, 'Failled to delete, This Schedule is associated with booking');
  }

  //check if scheduleId is associated with table
  const associateWithTable = await TableModel.findOne({ scheduleId });
  if(associateWithTable){
      throw new AppError(409, 'Failled to delete, This Schedule is associated with Table');
  }


 const result = await ScheduleModel.deleteOne({
   _id: scheduleId,
   ownerId: loginUserId
 });
 return result;
}

// const createScheduleOldService = async (loginUserId: string, payload: TSchedulePayload) => {
//   const {duration, startDate, endDate, startTime, endTime, availableSeats, bookingFee, availability, paymentRequired } = payload;
//   //check restaurant not found
//   const restaurant = await RestaurantModel.findOne({
//       ownerId: loginUserId
//     });
//     if (!restaurant) {
//       throw new AppError(404, "Restaurant not found");
//     }


//   // schedule creation part

//   const schedules = [];
//   //duration = const timeSlotMinutes = 30; // Schedule interval = unit = minutes

//   // Convert start and end date to UTC
//   const startDateObj = new Date(`${startDate}T00:00:00.000Z`);
//   const endDateObj = new Date(`${endDate}T00:00:00.000Z`);

//   for (let currentDate = new Date(startDateObj); currentDate <= endDateObj; currentDate.setUTCDate(currentDate.getUTCDate() + 1)) {
//       let currentDay = new Date(currentDate);

//       // Parse start and end time as UTC
//       const [startHour, startMinute] = startTime.split(":").map(Number);
//       let startDateTime = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), startHour, startMinute, 0));

//       const [endHour, endMinute] = endTime.split(":").map(Number);
//       let endDateTimeLimit = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), endHour, endMinute, 0));

//      // console.log(isDifferenceDuration(startDateTime, endDateTimeLimit, duration)); true or false
//      //check if startDateTime is less than endDateTimeLimit
//      //check if difference between startDateTime & endDateTimeLimit = duration time
//      //or check if difference between startDateTime & endDateTimeLimit is greater than duration time
//       while (startDateTime < endDateTimeLimit && isDifferenceDuration(startDateTime, endDateTimeLimit, duration)) {
//           let endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000); // Add duration minutes
          
//           const scheduleData = {
//             ownerId: loginUserId,
//             restaurantId: restaurant._id,
//             startDateTime: startDateTime,
//             endDateTime: endDateTime,
//           };

//           //check if schedule exist
//           const existingSchedule = await ScheduleModel.findOne(scheduleData);

//           if(!existingSchedule){
//               schedules.push({
//                 ...scheduleData,
//                 availableSeats,
//                 bookingFee,
//                 availability,
//                 paymentRequired
//               })
//           }

//           startDateTime = endDateTime; // Move to the next slot
//       }
//   }

//   const result = await ScheduleModel.insertMany(schedules);
//   return result;
// }
export {
    createScheduleService,
    getSchedulesService,
    getScheduleDropDownService,
    getUserSchedulesService,
    getSingleScheduleService,
    deleteScheduleService
}