import AppError from "../../errors/AppError";
import RestaurantModel from "../Restaurant/restaurant.model";
import { TSchedulePayload } from "./schedule.interface"
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
                restaurantId: restaurant._id,
                startDateTime: startDateTime,
                endDateTime: endDateTime
            }

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


export {
    createScheduleService
}