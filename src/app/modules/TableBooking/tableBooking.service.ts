import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import TableModel from "../Table/table.model"
import { ITableBooking } from "./tableBooking.interface"
import TableBookingModel from "./tableBooking.model"


const createTableBookingService = async (loginUserId:string, payload: ITableBooking) => {
    const {name, tableId, guest } = payload;
    const table = await TableModel.findOne({
        _id: tableId,
        ownerId: loginUserId
    })

    if(!table){
        throw new AppError(404, "Table Not found");
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
        guest,
        tableId,
        scheduleId: table.scheduleId,
        restaurantId: table.restaurantId,
        diningId: table.diningId,
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

export {
    createTableBookingService
}