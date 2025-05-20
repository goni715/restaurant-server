import { Schema, model } from "mongoose";
import { ICalendar } from "./Reservation.interface";

const calendarSchema = new Schema<ICalendar>(
  {
    scheduleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Schedule",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Schedule",
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    diningId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Dining",
    },
    seats: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0; // Ensures the number is positive
        },
        message: "seats must be a positive number",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CalendarModel = model<ICalendar>("Calendar", calendarSchema);
export default CalendarModel;
