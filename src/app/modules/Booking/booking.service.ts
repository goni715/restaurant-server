import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import ScheduleModel from "../Schedule/schedule.model";
import { IBookingPayload } from "./booking.interface"
import BookingModel from "./booking.model";
import PaymentModel from "../Payment/payment.model";


const createBookingWithoutPaymentService = async (
  loginUserId: string,
  payload: IBookingPayload
) => {
  const { scheduleId, guest } = payload;
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
    return newBooking[0];
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
  const { scheduleId, amount, guest } = payload;
   const ObjectId = Types.ObjectId;
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
        amount,
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
    const transactionId = new ObjectId().toString();
    await PaymentModel.create({
        bookingId: newBooking[0]?._id,
        amount,
        transactionId
    })


    await session.commitTransaction();
    await session.endSession();
    return newBooking[0];
  }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
  }
};

const getBookingsService = async () => {

}

export { createBookingWithoutPaymentService, createBookingWithPaymentService };