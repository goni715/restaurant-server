import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import ScheduleModel from "../Schedule/schedule.model";
import { IBookingPayload } from "./booking.interface"
import BookingModel from "./booking.model";


const createBookingService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { scheduleId, price, guest } = payload;
  //check schedule not found
  const schedule = await ScheduleModel.findById(scheduleId);
  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

  //check schedule is already booked
  if(schedule.isBooked){
    throw new AppError(403, `Schedule is already booked`);
  }


  const session = await mongoose.startSession();
  try{
    session.startTransaction();

    //database-process-01
    //create the booking
    const newBooking = await BookingModel.create([{
        userId: loginUserId,
        scheduleId,
        restaurantId: schedule.restaurantId,
        price,
        guest,
    }], { session });


    //database-process-02
    //update the schedule
    await ScheduleModel.updateOne(
        { _id: scheduleId},
        { isBooked: true },
        { session }
    )

    
    //database-process-03
    //create the payment


    await session.commitTransaction();
    await session.endSession();
    return newBooking;
  }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
  }
};

export { createBookingService };