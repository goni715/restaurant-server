import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import RestaurantModel from "../Restaurant/restaurant.model";
import { TSchedulePayload, TScheduleQuery } from "./schedule.interface"
import ScheduleModel from "./schedule.model";


const createScheduleService = async (loginUserId: string, payload: TSchedulePayload) => {
    const { startDate, endDate, startTime, endTime } = payload;
    //check restaurant not found
    const restaurant = await RestaurantModel.findOne({
        ownerId: loginUserId
      });
      if (!restaurant) {
        throw new AppError(404, "Restaurant not found");
      }


    // schedule creation part

    const schedules = [];
    const timeSlotMinutes = 30; // Schedule interval

    // Convert start and end date to UTC
    const startDateObj = new Date(`${startDate}T00:00:00.000Z`);
    const endDateObj = new Date(`${endDate}T00:00:00.000Z`);

    for (let currentDate = new Date(startDateObj); currentDate <= endDateObj; currentDate.setUTCDate(currentDate.getUTCDate() + 1)) {
        let currentDay = new Date(currentDate);

        // Parse start and end time as UTC
        const [startHour, startMinute] = startTime.split(":").map(Number);
        let startDateTime = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), startHour, startMinute, 0));

        const [endHour, endMinute] = endTime.split(":").map(Number);
        let endDateTimeLimit = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), endHour, endMinute, 0));

        while (startDateTime < endDateTimeLimit) {
            let endDateTime = new Date(startDateTime.getTime() + timeSlotMinutes * 60 * 1000); // Add 30 
            
            const scheduleData = {
              ownerId: loginUserId,
              restaurantId: restaurant._id,
              startDateTime: startDateTime,
              endDateTime: endDateTime,
            };

            //check if schedule exist
            const existingSchedule = await ScheduleModel.findOne(scheduleData);

            if(!existingSchedule){
                schedules.push(scheduleData)
            }

            startDateTime = endDateTime; // Move to the next slot
        }
    }

    const result = await ScheduleModel.insertMany(schedules);
    return result;
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
             startDateTime: { $gte: new Date(start), $lte: new Date(end) }
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
        { $sort: { [sortBy]: sortDirection } },
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
  //check restaurant not found
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId,
  });
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  //check schedule not found
  const schedule = await ScheduleModel.findOne({ _id: scheduleId, restaurantId: restaurant._id });
  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

 
  if(schedule.isBooked===true){
    throw new AppError(403, 'Failled to delete, This schedule is already booked')
  }

 const result = await ScheduleModel.deleteOne({
   _id: scheduleId,
   restaurantId: restaurant._id,
 });
 return result;
}

export {
    createScheduleService,
    getSchedulesService,
    getSingleScheduleService,
    deleteScheduleService
}