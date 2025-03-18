import { model, Schema } from "mongoose";
import { INotification } from "./notification.interface";



const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const NotificationModel = model<INotification>("Notification", notificationSchema);
export default NotificationModel;
