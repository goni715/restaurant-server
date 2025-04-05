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
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    guest: {
      type: Number,
      required: true,
      trim:true
    },
    availability: {
      type: String,
      required: true,
      enum: ["Immediate Seating", "Open Reservations", "Waitlist"],
      default: "Immediate Seating"
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TableBookingModel = model<ITableBooking>('TableBooking', tableBookingSchema);
export default TableBookingModel;