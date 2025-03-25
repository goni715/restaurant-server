import { model, Schema } from "mongoose";
import { IBooking } from "./booking.interface";



const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Schedule",
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    amount: {
        type: Number,
        default: 0,
        trim: true
    },
    guest: {
        type: Number,
        required: true,
        trim:true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BookingModel = model<IBooking>('Booking', bookingSchema);
export default BookingModel;