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
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ScheduleModel = model<ISchedule>('Schedule', scehduleSchema);
export default ScheduleModel;