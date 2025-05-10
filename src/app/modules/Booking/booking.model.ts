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
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      minlength: [6, "Token must be 6 characters long"],
      maxlength: [6, "Token must be 6 characters long"]
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
    cancellationCharge: {
      type: Number,
      default: 0 
    },
    status: {
        type: String,
        enum: ["pending", "waitlist", "seating"],
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