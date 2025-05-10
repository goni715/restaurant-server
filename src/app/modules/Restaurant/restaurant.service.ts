import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import {
  IChangeApprovalStatus,
  IChangeRestaurantStatus,
  INearbyQuery,
  IRestaurant,
  IRestaurantPayload,
  TApprovedStatus,
  TRestaurantQuery,
  TRestaurantStatus,
  TUserRestaurantQuery,
} from "./restaurant.interface";
import RestaurantModel from "./restaurant.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import {
  RestaurantSearchFields,
  UserRestaurantSearchFields,
} from "./restaurant.constant";
import { Request } from "express";
import SocialMediaModel from "../SocialMedia/socialMedia.model";
import MenuModel from "../Menu/menu.model";
import FavouriteModel from "../Favourite/favourite.model";
import ReviewModel from "../Review/review.model";
import MenuReviewModel from "../MenuReview/menuReview.model";
import ScheduleModel from "../Schedule/schedule.model";
import BookingModel from "../Booking/booking.model";
import UserModel from "../User/user.model";
import { INotification } from "../Notification/notification.interface";
import NotificationModel from "../Notification/notification.model";
import ObjectId from "../../utils/ObjectId";
import uploadImage from "../../utils/uploadImage";
import slugify from "slugify";

const createRestaurantService = async (
  req: Request,
  ownerId: string,
  payload: IRestaurantPayload
) => {
  const { name, longitude, latitude, ...restData } = payload;
  const slug = slugify(name).toLowerCase();

  //check restaurant owner is already exist
  const owner = await RestaurantModel.findOne({ ownerId });
  if (owner) {
    throw new AppError(409, "Sorry! You have already a restaurant");
  }

  //check restaurant
  const restaurant = await RestaurantModel.findOne({ slug });
  if (restaurant) {
    throw new AppError(409, "This restaurant name is already taken or existed");
  }

  // if(!req.file){
  //   throw new AppError(400, "image is required");
  // }

  const newRestaurantData: IRestaurant = {
    name,
    slug,
    ownerId: new ObjectId(ownerId),
    ...restData,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  };

  //upload the image
  if (req.file) {
    newRestaurantData.restaurantImg = await uploadImage(req);
  }

  //create the restaurant
  const result = await RestaurantModel.create({ ...newRestaurantData });
  return result;
};

const getRestaurantsService = async (query: TRestaurantQuery) => {
  // 1. Extract query parameters
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortOrder = "desc",
    sortBy = "createdAt",
    ...filters // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery: any = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, RestaurantSearchFields);
    searchQuery = {
      $or: [
        ...searchQuery?.$or,
        { keywords: { $in: [new RegExp(searchTerm, "i")] } },
      ],
    };
  }

  //console.dir(searchQuery, {depth:null})

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  const result = await RestaurantModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner", //divide the array into the object=make seprate document
    },
    {
      $lookup: {
        from: "menus", // Menu collection
        localField: "_id",
        foreignField: "restaurantId",
        as: "menus",
      },
    },
    {
      $lookup: {
        from: "cuisines", // Cuisine collection
        localField: "menus.cuisineId",
        foreignField: "_id",
        as: "cuisine",
      },
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        ownerId: 1,
        name: 1,
        location: 1,
        address: 1,
        keywords: 1,
        features: 1,
        cancellationCharge: 1,
        discount: 1,
        ratings: 1,
        restaurantImg: 1,
        totalReview: 1,
        status: 1,
        approved: 1,
        createdAt: 1,
        updatedAt: 1,
        ownerName: "$owner.fullName",
        ownerEmail: "$owner.email",
        ownerPhone: "$owner.phone",
        ownerImg: "$owner.profileImg",
        ownerAddress: "$owner.address",
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalRestaurantResult = await RestaurantModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "menus", // Menu collection
        localField: "_id",
        foreignField: "restaurantId",
        as: "menus",
      },
    },
    {
      $lookup: {
        from: "cuisines", // Cuisine collection
        localField: "menus.cuisineId",
        foreignField: "_id",
        as: "cuisine",
      },
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    { $count: "totalCount" },
  ]);

  const totalCount = totalRestaurantResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

  return {
    meta: {
      page: Number(page), //currentPage
      limit: Number(limit),
      totalPages,
      total: totalCount,
    },
    data: result,
  };
};

const getUserRestaurantsService = async (query: TUserRestaurantQuery) => {
  // 1. Extract query parameters
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortOrder = "desc",
    sortBy = "createdAt",
    ...filters // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery: any = {};

  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, UserRestaurantSearchFields);
    searchQuery = {
      $or: [
        ...searchQuery?.$or,
        { keywords: { $in: [new RegExp(searchTerm, "i")] } },
      ],
    };
  }

  //console.dir(searchQuery, {depth:null})

  //5 setup filters

  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  const result = await RestaurantModel.aggregate([
    {
      $match: {
        status: "active",
        approved: "accepted",
      },
    },
    {
      $lookup: {
        from: "menus", // Menu collection
        localField: "_id",
        foreignField: "restaurantId",
        as: "menus",
      },
    },
    {
      $lookup: {
        from: "cuisines", // Cuisine collection
        localField: "menus.cuisineId",
        foreignField: "_id",
        as: "cuisine",
      },
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        ownerId: 1,
        name: 1,
        location: 1,
        keywords: 1,
        features: 1,
        cancellationCharge: 1,
        discount: 1,
        ratings: 1,
        totalReview: 1,
        createdAt: 1,
        updatedAt: 1,
        ownerName: "$owner.fullName",
        ownerEmail: "$owner.email",
        ownerPhone: "$owner.phone",
        ownerImg: "$owner.profileImg",
        ownerAddress: "$owner.address",
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalRestaurantResult = await RestaurantModel.aggregate([
    {
      $match: {
        status: "active",
        approved: "accepted",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "menus", // Menu collection
        localField: "_id",
        foreignField: "restaurantId",
        as: "menus",
      },
    },
    {
      $lookup: {
        from: "cuisines", // Cuisine collection
        localField: "menus.cuisineId",
        foreignField: "_id",
        as: "cuisine",
      },
    },
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    { $count: "totalCount" },
  ]);

  const totalCount = totalRestaurantResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

  return {
    meta: {
      page: Number(page), //currentPage
      limit: Number(limit),
      totalPages,
      total: totalCount,
    },
    data: result,
  };
};

const getOwnerRestaurantService = async (loginUserId: string) => {
  const ObjectId = Types.ObjectId;
  const result = await RestaurantModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
     {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id:1,
        ownerId: 1,
        name: 1,
        slug: 1,
        keywords: 1,
        features: 1,
        discount: 1,
        ratings: 1,
        totalReview:1,
        restaurantImg: 1,
        location: 1,
        coordinates: "$location.coordinates",
        address: 1,
        paymentRequired: 1,
        bookingFeePerGuest: 1,
        cancellationPercentage: 1,
        status: 1,
        approved: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $addFields: {
        longitude: { $max: "$coordinates" },
        latitude: { $min: "$coordinates" }
      }
    }
  ]);

  if (result.length === 0) {
    throw new AppError(404, "Restaurant not found");
  }

  return result[0];
};

const getSingleRestaurantService = async (restaurantId: string) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.aggregate([
    {
      $match: {
        _id: new ObjectId(restaurantId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        ownerId: 1,
        name: 1,
        cuisine: 1,
        dining: 1,
        website: 1,
        location: 1,
        address: 1,
        keywords: 1,
        ratings: 1,
        totalReview: 1,
        price: 1,
        features: 1,
        cancellationCharge: 1,
        discount: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        ownerName: "$owner.fullName",
        ownerEmail: "$owner.email",
        ownerPhone: "$owner.phone",
        ownerImg: "$owner.profileImg",
        ownerAddress: "$owner.address",
      },
    },
  ]);
  if (restaurant.length === 0) {
    throw new AppError(404, "Restaurant Not Found");
  }

  return restaurant[0];
};

const findNearbyRestaurantsService = async (query: INearbyQuery) => {
  const { longitude, latitude } = query; // get from query params
  const radius = 20; //5 kilometers
  const earthRadiusInKm = 6378.1;

  if (!longitude || !latitude) {
    throw new AppError(400, "Longitude and latitude are required");
  }

  const result = await RestaurantModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [Number(longitude), Number(latitude)], // [longitude, latitude]
          Number(radius) / earthRadiusInKm, // Convert radius to radians
        ],
      },
    },
  });
  return result;
};

const changeRestaurantStatusService = async (
  restaurantId: string,
  payload: IChangeRestaurantStatus
) => {
  const { status } = payload;

  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  //transaction & rollback part
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //database-process-01
    //update the restaurant
    const result = await RestaurantModel.updateOne(
      { _id: new ObjectId(restaurantId) },
      { status: status },
      { session }
    );

    //database-process-02
    //create a notification
    await NotificationModel.create({
      userId: restaurant?.ownerId,
      title: "Restaurant Status",
      message: `Your Restaurant is ${
        status === "active" ? "activated" : "deactivated"
      } successfully`,
      type: `${status === "active" ? "success" : "error"}`,
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const approveRestaurantService = async (
  restaurantId: string,
  approved: IChangeApprovalStatus
) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  //transaction & rollback part
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //database-process-01
    //update the restaurant
    const result = await RestaurantModel.updateOne(
      { _id: new ObjectId(restaurantId) },
      { approved }
    );

    //database-process-02
    //create a notification
    await NotificationModel.create({
      userId: restaurant?.ownerId,
      title: "Approval Status",
      message: `Your Restaurant is ${approved} successfully`,
      type: `${approved === "accepted" ? "success" : "error"}`,
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateRestaurantService = async (
  ownerId: string,
  payload: Partial<IRestaurantPayload>
) => {
  const { longitude, latitude } = payload;
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.findOne({
    ownerId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

 //update the location
 if(longitude && latitude){
  payload.location={
    type: "Point",
    coordinates: [Number(longitude), Number(latitude)]
  }
 }

  const result = await RestaurantModel.updateOne(
    { ownerId: new ObjectId(ownerId) },
    payload,
    { runValidators: true }
  );

  return result;
};

const updateRestaurantImgService = async (
  req: Request,
  loginUserId: string
) => {
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  if (!req.file) {
    throw new AppError(400, "image is required");
  }

  //uploaded-image
  const image = await uploadImage(req);

  const result = await RestaurantModel.updateOne(
    { ownerId: loginUserId },
    { restaurantImg: image }
  );

  return result;
};

const deleteRestaurantService = async (loginUserId: string) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.findOne({
    ownerId: loginUserId,
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  //check if restaurantId is associated with booking
  const associateWithBooking = await BookingModel.findOne({
    restaurantId: restaurant._id,
  });
  if (associateWithBooking) {
    throw new AppError(
      409,
      "Failled to delete, This restaurant is associated with booking"
    );
  }

  //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //delete social media
    await SocialMediaModel.deleteOne(
      { ownerId: new ObjectId(loginUserId) },
      { session }
    );

    //delete menus
    await MenuModel.deleteMany(
      { ownerId: new ObjectId(loginUserId) },
      { session }
    );

    //delete favourite list
    await FavouriteModel.deleteMany(
      { restaurantId: new ObjectId(restaurant._id) },
      { session }
    );

    //delete the reviews
    await ReviewModel.deleteMany(
      { restaurantId: new ObjectId(restaurant._id) },
      { session }
    );

    //delete the menu reviews
    await MenuReviewModel.deleteMany(
      { restaurantId: new ObjectId(restaurant._id) },
      { session }
    );

    //delete the schedule
    await ScheduleModel.deleteMany(
      { restaurantId: new ObjectId(restaurant._id) },
      { session }
    );

    //delete restaurant
    const result = await RestaurantModel.deleteOne(
      { ownerId: new ObjectId(loginUserId) },
      { session }
    );

    //transaction success
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export {
  createRestaurantService,
  getRestaurantsService,
  getUserRestaurantsService,
  getOwnerRestaurantService,
  changeRestaurantStatusService,
  getSingleRestaurantService,
  findNearbyRestaurantsService,
  approveRestaurantService,
  updateRestaurantService,
  updateRestaurantImgService,
  deleteRestaurantService,
};
