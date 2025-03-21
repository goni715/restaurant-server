import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { IMenuReview, TMenuReviewQuery } from "./menuReview.interface";
import MenuModel from "../Menu/menu.model";
import MenuReviewModel from "./menuReview.model";
import { MenuReviewSearchFields } from "./menuReview.constant";


const createMenuReviewService = async (
  loginUserId: string,
  payload: IMenuReview
) => {
  const ObjectId = Types.ObjectId;
  const { menuId, star } = payload;
  //check menu not exist
  const menu = await MenuModel.findById(menuId);
  if (!menu) {
    throw new AppError(404, "Menu Not Found");
  }

  //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create a new review
    await MenuReviewModel.create(
      [{
        userId: loginUserId,
        menuId,
        star
      }],
      { session }
    );

    //find the average ratings value
    const averageRatingsResult = await MenuReviewModel.aggregate(
      [
        {
          $match: { menuId : new ObjectId(menuId) },
        },
        {
          $group: {
            _id: "$menuId",
            averageRating: { $avg: "$star" },
          },
        },
      ],
      { session }
    );

    const averageRatings =
      averageRatingsResult.length > 0
        ? Number((averageRatingsResult[0]?.averageRating).toFixed(1))
        : menu.ratings;

    // //update the ratings
    const result = await MenuModel.updateOne(
      { _id: new ObjectId(menuId) },
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


const deleteMenuReviewService = async (reviewId: string) => {
  const ObjectId = Types.ObjectId;  

   //check review not exist
   const review = await MenuReviewModel.findById(reviewId);
   if (!review) {
     throw new AppError(404, "Review Not Found");
   }

   //delete the review
   const result = await MenuReviewModel.deleteOne({
    _id: new ObjectId(reviewId)
   })

   return result;
}


const getMenuReviewsService = async (menuId: string, query: TMenuReviewQuery) => {
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
      searchQuery = makeSearchQuery(searchTerm, MenuReviewSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }
  
   //check menu not found
   const menu = await MenuModel.findById(menuId);
   if (!menu) {
     throw new AppError(404, "Menu Not Found");
   }

  const result = await MenuReviewModel.aggregate([
    {
      $match: { menuId: new ObjectId(menuId) }
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
        createdAt: "$createdAt"
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])

   // total count of matching reviews
  const totalReviewResult = await MenuReviewModel.aggregate([
    {
        $match: { menuId: new ObjectId(menuId) }
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
    createMenuReviewService,
    deleteMenuReviewService,
    getMenuReviewsService
}