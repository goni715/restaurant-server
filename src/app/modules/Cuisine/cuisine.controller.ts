import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCuisineService, deleteCuisineService, getCuisinesService, updateCuisineService } from "./cuisine.service";


const createCuisine = catchAsync(async (req, res) => {
  const { name } = req.body;
  const result = await createCuisineService(name);

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


const updateCuisine = catchAsync(async (req, res) => {
  const { cuisineId } = req.params;
  const { name } = req.body;
  const result = await updateCuisineService(cuisineId, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cuisine is updated successfully",
    data: result
  });
});


const deleteCuisine = catchAsync(async (req, res) => {
  const { cuisineId } = req.params;
  const result = await deleteCuisineService(cuisineId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cuisine is deleted successfully",
    data: result
  });
});


const CuisineController = {
  createCuisine,
  getCuisines,
  updateCuisine,
  deleteCuisine
}

export default CuisineController;