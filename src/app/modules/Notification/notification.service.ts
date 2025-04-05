import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { INotification, TNotificationQuery } from "./notification.interface"
import NotificationModel from "./notification.model";
import UserModel from "../User/user.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { NotificationSearchFields } from "./notification.constant";



const createNotificationService = async (payload: INotification) => {

  const user = await UserModel.findById(payload.userId)
  if (!user) {
    throw new AppError(404, "User Not Found");
  }
  
  const result = await NotificationModel.create(payload);
  return result;
}


const getUserNotificationsService = async (loginUserId: string, query: TNotificationQuery) => {
  const ObjectId = Types.ObjectId;
    // 1. Extract query parameters
    const {
      searchTerm, 
      page = 1, 
      limit = 10, 
      sortOrder = "desc",
      sortBy = "createdAt", 
      ...filters  // Any additional filters
    } = query;
  
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
  
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
  
    //4. setup searching
    let searchQuery = {};
  
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, NotificationSearchFields);
    }
  
    //5 setup filters
  
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }


  const result = await NotificationModel.aggregate([
    {
      $match: {
         userId: new ObjectId(loginUserId),
         ...searchQuery,
         ...filterQuery
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) } 
  ]);

   // total count of matching notifications
   const totalCount = await NotificationModel.countDocuments({
    userId: new ObjectId(loginUserId),
    ...searchQuery, 
    ...filterQuery, 
  });

  return {
    meta: {
      page: Number(page), //currentPage
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit)),
      total: totalCount,
    },
    data: result,
  };
}

const markAsReadService = async (loginUserId:string, notificationId: string) => {
  const ObjectId = Types.ObjectId;
  const notification = await NotificationModel.findOne({userId: loginUserId, _id: notificationId});
  if (!notification) {
    throw new AppError(404, "Notification Not Found");
  }

  const result = await NotificationModel.updateOne(
    { _id: new ObjectId(notificationId) },
    { isRead: true }
  )

  return result;
};


const deleteNotificationService = async (notificationId: string) => {
  const notification = await NotificationModel.findOne({_id: notificationId});
  if (!notification) {
    throw new AppError(404, "Notification Not Found");
  }

  const result = await NotificationModel.deleteOne({ _id: notificationId});
  return result;
}

export {
    createNotificationService,
    getUserNotificationsService,
    markAsReadService,
    deleteNotificationService
}