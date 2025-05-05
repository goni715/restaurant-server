import { model, Schema } from "mongoose";
import { ITableBooking } from "./tableBooking.interface";



const tableBookingSchema = new Schema<ITableBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Booking"
   },
    tableId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Table"
    },
    scheduleId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Schedule"
    },
    diningId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Dining"
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    
    // availability: {
    //   type: String,
    //   required: true,
    //   default: "Waitlist",
    //   enum: {
    //     values: [ "Waitlist", "Seating", "Booked","Completed"],
    //     message: '{VALUE} is not supported'
    //   }
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TableBookingModel = model<ITableBooking>('TableBooking', tableBookingSchema);
export default TableBookingModel;