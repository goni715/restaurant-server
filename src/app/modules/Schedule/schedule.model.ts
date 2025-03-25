import { model, Schema } from "mongoose";
import { ISchedule } from "./schedule.interface";



const scehduleSchema = new Schema<ISchedule>(
  {
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
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0; // Ensures the number is positive
        },
        message: "available seats must be a positive number",
      },
    },
    availability: {
      type: String,
      required: true,
      enum: ["Immediate seating", "Open Reservations", "Waitlist"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ScheduleModel = model<ISchedule>('Schedule', scehduleSchema);
export default ScheduleModel;