import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { NotificationValidFields } from "./notification.constant";
import { createNotificationService, deleteNotificationService, getUserNotificationsService, markAsReadService } from "./notification.service";


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
  const validatedQuery = pickValidFields(req.query, NotificationValidFields);
  const result = await getUserNotificationsService(loginUserId as string, validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});


const deleteNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const result = await deleteNotificationService(notificationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification is deleted successfully",
    data: result,
  });
});

const NotificationController = {
    createNotification,
    markAsRead,
    getUserNotifications,
    deleteNotification
 }
 
 export default NotificationController;