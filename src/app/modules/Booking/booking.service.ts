import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import ScheduleModel from "../Schedule/schedule.model";
import { IBookingPayload } from "./booking.interface"
import BookingModel from "./booking.model";


const createBookingWithoutPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { scheduleId, price, guest } = payload;
  //check schedule not found
  const schedule = await ScheduleModel.findById(scheduleId);
  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

  const availableSeats = schedule.availableSeats;
  if(availableSeats < guest){
    throw new AppError(400, "There are no available seats during this schedule")
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
        { _id: scheduleId, availableSeats: { $gt: 0 }},
        { $inc: { availableSeats: - guest } }, // Decrease availableSeats
        { session }
    )

    
    await session.commitTransaction();
    await session.endSession();
    return newBooking;
  }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
  }
};



const createBookingWithPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  return "Without Payment"
  const { scheduleId, price, guest } = payload;
  //check schedule not found
  const schedule = await ScheduleModel.findById(scheduleId);
  if (!schedule) {
    throw new AppError(404, "Schedule not found");
  }

  const availableSeats = schedule.availableSeats;
  if(availableSeats < guest){
    throw new AppError(400, "There are no available seats during this schedule")
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
        { _id: scheduleId, availableSeats: { $gt: 0 }},
        { $inc: { availableSeats: - guest } }, // Decrease availableSeats
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

export { createBookingWithoutPaymentService, createBookingWithPaymentService };