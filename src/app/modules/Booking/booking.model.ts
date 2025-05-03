import { model, Schema } from "mongoose";
import { IBooking } from "./booking.interface";



const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    date: {
      type: Date,
      required: true
    },
    checkIn: {
      type: String,
      required: true
    },
    checkOut: {
      type: String,
      required: true
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
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