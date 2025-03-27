import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import RestaurantModel from "../Restaurant/restaurant.model";
import { ISlot } from "./slot.interface";
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

const getSlotsService = async (loginUserId: string) => {
    const ObjectId = Types.ObjectId;
    const result = await SlotModel.aggregate([
        {
            $match: {
                ownerId: new ObjectId(loginUserId)
            }
        },
        {
            $sort: { startDateTime:1, endDateTime:1}
        }
    ]);

    return result;
}

export {
    createSlotService,
    getSlotsService
}