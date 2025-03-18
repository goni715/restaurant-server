import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createNotificationService } from "./notification.service";


const createNotification = catchAsync(async (req, res) => {
  const result = await createNotificationService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review is created successfully",
    data: result,
  });
});



const NotificationController = {
    createNotification
 }
 
 export default NotificationController;