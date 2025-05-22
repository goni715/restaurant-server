import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import RestaurantModel from "../Restaurant/restaurant.model";
import { ISlot, TSlotQuery } from "./slot.interface";
import SlotModel from "./slot.model";


const createSlotService = async (loginUserId: string, payload: ISlot) => {

   //check restaurant not found
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId
  });
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  //destructuring the payload
  const { startTime, endTime } = payload;


  const slot = await SlotModel.findOne({
    restaurantId: restaurant._id,
    ownerId: loginUserId,
    startTime,
    endTime
  })

  if(slot){
    throw new AppError(409, "This slot is already existed");
  }

  const currentDay = new Date("2025-01-01T00:00:00.000Z");

  // Parse start and end time as UTC
  const [startHour, startMinute] = startTime.split(":").map(Number);
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

  const [endHour, endMinute] = endTime.split(":").map(Number);
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


  const result = await SlotModel.create({
    restaurantId: restaurant._id,
    ownerId: loginUserId,
    startTime,
    endTime,
    startDateTime,
    endDateTime
  })

  return result;
}

const getSlotsService = async (loginUserId: string, query:TSlotQuery) => {
    const ObjectId = Types.ObjectId;
   
  // 1. Extract query parameters
  const {
    page = 1, 
    limit = 10, 
  } = query;


  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

    const result = await SlotModel.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId)
            }
        },
        {
            $sort: { startDateTime:1, endDateTime:1}
        },
        {
            $project: {
                startDateTime: 1,
                endDateTime:1,
                startTime:1,
                endTime:1
            }
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);


    //count the total slot
    const totalSlotResult = await SlotModel.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId)
            }
        },
        { $count: "totalCount" }
    ]);


    
  const totalCount = totalSlotResult[0]?.totalCount || 0;
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


const getSlotDropDownService = async (loginUserId: string) => {
    const ObjectId = Types.ObjectId;
    const result = await SlotModel.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId)
            }
        },
        {
            $project: {
                startDateTime: 1,
                endDateTime:1,
                startTime:1,
                endTime:1
            }
        },
        {
            $sort: { startDateTime:1, endDateTime:1}
        }
    ]);

    return result;
}

const deleteSlotService = async (loginUserId: string, slotId: string) => {
  //check slot not found
  const slot = await SlotModel.findOne({
   _id: slotId,
   ownerId: loginUserId,
 });

 if (!slot) {
   throw new AppError(404, "Slot not found");
 }

 const result = await SlotModel.deleteOne({
   _id: slotId,
   ownerId: loginUserId
 },)
 return result;
}

export {
    createSlotService,
    getSlotsService,
    getSlotDropDownService,
    deleteSlotService
}