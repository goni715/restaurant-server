import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createReviewService, deleteReviewService, getRestaurantReviewsService } from "./review.service";



const createReview = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createReviewService(
    loginUserId as string,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review is created successfully",
    data: result,
  });
});




const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const result = await deleteReviewService(
    reviewId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review is deleted successfully",
    data: result,
  });
});


const getRestaurantReviews = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const result = await getRestaurantReviewsService(
    restaurantId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant's reviews are retrived successfully",
    data: result,
  });
});


const ReviewController = {
    createReview,
    deleteReview,
    getRestaurantReviews
 }
 
 export default ReviewController;