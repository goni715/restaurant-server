import { Schema, model } from "mongoose";
import { IReservation } from "./Reservation.interface";

const reservationSchema = new Schema<IReservation>(
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
    dinings: {
      type: [Schema.Types.ObjectId],
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

const ReservationModel = model<IReservation>("Reservation", reservationSchema);
export default ReservationModel;
