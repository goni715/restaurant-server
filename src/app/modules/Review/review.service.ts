import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import RestaurantModel from "../Restaurant/restaurant.model";
import { IReviewPayload } from "./review.interface";
import ReviewModel from "./review.model";


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

  // Create a new review
  await ReviewModel.create({
    userId: loginUserId,
    restaurantId,
    star,
    comment,
  });


//find the average ratings value
const averageRatingsResult = await ReviewModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId) }, 
    },
    {
        $group: {
          _id: "$restaurantId",
          averageRating: { $avg: "$star" },
        },
    }
  ]);

  const averageRatings = averageRatingsResult.length > 0 ? Number((averageRatingsResult[0]?.averageRating).toFixed(1)) : restaurant.ratings;

  //update the ratings
  const result = await RestaurantModel.updateOne(
    { _id: new ObjectId(restaurantId) },
    { ratings: averageRatings }
  )

  return result;
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


const getRestaurantReviewsService = async (restaurantId: string) => {
  const ObjectId = Types.ObjectId;
  
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
      $project: {
        _id: "$user._id",
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        star: "$star",
        comment: "$comment",
        createdAt: "$createdAt"
      }
    }
  ])

  return result;
   
}

export {
    createReviewService,
    deleteReviewService,
    getRestaurantReviewsService
}