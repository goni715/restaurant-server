import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createReviewService } from "./review.service";



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



const ReviewController = {
    createReview,
 }
 
 export default ReviewController;