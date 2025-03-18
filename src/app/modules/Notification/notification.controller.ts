import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createNotificationService, getUserNotificationsService, markAsReadService } from "./notification.service";


const createNotification = catchAsync(async (req, res) => {
  const result = await createNotificationService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification is created successfully",
    data: result,
  });
});


const markAsRead = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { notificationId } = req.params;
  const result = await markAsReadService(loginUserId as string, notificationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification is created successfully",
    data: result,
  });
});


const getUserNotifications = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getUserNotificationsService(loginUserId as string, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});


const NotificationController = {
    createNotification,
    markAsRead,
    getUserNotifications
 }
 
 export default NotificationController;