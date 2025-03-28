import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { MenuReviewValidFields } from "./menuReview.constant";
import { createMenuReviewService, deleteMenuReviewService, getMenuReviewsService } from "./menuReview.service";



const createMenuReview = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createMenuReviewService(
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




const deleteMenuReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const result = await deleteMenuReviewService(
    reviewId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review is deleted successfully",
    data: result,
  });
});


const getMenuReviews = catchAsync(async (req, res) => {
  const { menuId } = req.params;
  const validatedQuery = pickValidFields(req.query, MenuReviewValidFields);
  const result = await getMenuReviewsService(
    menuId,
    validatedQuery
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Menu's reviews are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});


const MenuReviewController = {
    createMenuReview,
    deleteMenuReview,
    getMenuReviews
 }
 
 export default MenuReviewController;