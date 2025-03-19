import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCuisineService, getCuisinesService } from "./cuisine.service";


const createCuisine = catchAsync(async (req, res) => {
  const result = await createCuisineService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cuisine is created successfully",
    data: result
  });
});



const getCuisines = catchAsync(async (req, res) => {
  const result = await getCuisinesService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cuisines are retrived successfully",
    data: result
  });
});


const CuisineController = {
  createCuisine,
  getCuisines
}

export default CuisineController;