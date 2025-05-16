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
     guest: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0; // Ensures the number is positive
        },
        message: "seats must be a positive number",
      },
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TableBookingModel = model<ITableBooking>('TableBooking', tableBookingSchema);
export default TableBookingModel;