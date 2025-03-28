import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { ReviewValidFields } from "./review.constant";
import { createReviewService, deleteReviewService, getMyRestaurantReviewsService, getRestaurantReviewsService } from "./review.service";



const createReview = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createReviewService(
    loginUserId as string,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
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


const getMyRestaurantReviews = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, ReviewValidFields);
  const result = await getMyRestaurantReviewsService(
    loginUserId as string,
    validatedQuery
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant's reviews are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getRestaurantReviews = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const validatedQuery = pickValidFields(req.query, ReviewValidFields);
  const result = await getRestaurantReviewsService(
    restaurantId,
    validatedQuery
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant's reviews are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});


const ReviewController = {
    createReview,
    deleteReview,
    getMyRestaurantReviews,
    getRestaurantReviews
 }
 
 export default ReviewController;