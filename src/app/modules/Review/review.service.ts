import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import RestaurantModel from "../Restaurant/restaurant.model";
import { IReviewPayload, TReviewQuery } from "./review.interface";
import ReviewModel from "./review.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { ReviewSearchFields } from "./review.constant";


const createReviewService = async (
  loginUserId: string,
  payload: IReviewPayload
) => {
  const ObjectId = Types.ObjectId;
  const { restaurantId, star, comment } = payload;
  //check restaurant not exist
  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create a new review
    await ReviewModel.create(
      {
        userId: loginUserId,
        restaurantId,
        star,
        comment,
      },
      { session }
    );

    //find the average ratings value
    const averageRatingsResult = await ReviewModel.aggregate(
      [
        {
          $match: { restaurantId: new ObjectId(restaurantId) },
        },
        {
          $group: {
            _id: "$restaurantId",
            averageRating: { $avg: "$star" },
          },
        },
      ],
      { session }
    );

    const averageRatings =
      averageRatingsResult.length > 0
        ? Number((averageRatingsResult[0]?.averageRating).toFixed(1))
        : restaurant.ratings;

    //update the ratings
    const result = await RestaurantModel.updateOne(
      { _id: new ObjectId(restaurantId) },
      { ratings: averageRatings },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


const deleteReviewService = async (reviewId: string) => {
  const ObjectId = Types.ObjectId;  

   //check review not exist
   const review = await ReviewModel.findById(reviewId);
   if (!review) {
     throw new AppError(404, "Review Not Found");
   }

   //delete the review
   const result = await ReviewModel.deleteOne({
    _id: new ObjectId(reviewId)
   })

   return result;
}


const getRestaurantReviewsService = async (restaurantId: string, query: TReviewQuery) => {
  const ObjectId = Types.ObjectId;
    
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
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, ReviewSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }
  
   //check restaurant not exist
   const restaurant = await RestaurantModel.findById(restaurantId);
   if (!restaurant) {
     throw new AppError(404, "Restaurant Not Found");
   }

  const result = await ReviewModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        _id: "$user._id",
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        star: "$star",
        comment: "$comment",
        createdAt: "$createdAt"
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])

   // total count of matching users 
  const totalReviewResult = await ReviewModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
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
   
}

export {
    createReviewService,
    deleteReviewService,
    getRestaurantReviewsService
}