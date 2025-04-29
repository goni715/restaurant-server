import { model, Schema } from "mongoose";
import { ITableBooking } from "./tableBooking.interface";



const tableBookingSchema = new Schema<ITableBooking>(
  {
    name: {
      type: String,
      required: true,
      trim: true
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
    token: {
      type: String,
      minlength: [6, "Token must be 6 characters long"],
      maxlength: [6, "Token must be 6 characters long"]
    },
    guest: {
      type: Number,
      required: true,
      trim:true
    },
    availability: {
      type: String,
      required: true,
      default: "Waitlist",
      enum: {
        values: [ "Waitlist", "Seating", "Booked","Completed"],
        message: '{VALUE} is not supported'
      }
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TableBookingModel = model<ITableBooking>('TableBooking', tableBookingSchema);
export default TableBookingModel;