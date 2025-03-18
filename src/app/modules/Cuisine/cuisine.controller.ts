import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCuisineService } from "./cuisine.service";


const createCuisine = catchAsync(async (req, res) => {
  const result = await createCuisineService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cuisine is created successfully",
    data: result
  });
});



const CuisineController = {
  createCuisine
}

export default CuisineController;