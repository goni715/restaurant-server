import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { CuisineValidFields } from "./cuisine.constant";
import { createCuisineService, deleteCuisineService, getCuisineDropDownService, getCuisinesService, updateCuisineService } from "./cuisine.service";


const createCuisine = catchAsync(async (req, res) => {
  const { name } = req.body;
  const result = await createCuisineService(req, name);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Cuisine is created successfully",
    data: result
  });
});



const getCuisines = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, CuisineValidFields);
  const result = await getCuisinesService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cuisines are retrived successfully",
    meta: result.meta,
    data: result.data
  });
});


const getCuisineDropDown = catchAsync(async (req, res) => {
  const result = await getCuisineDropDownService()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cuisines are retrived successfully",
    data: result
  });
});


const updateCuisine = catchAsync(async (req, res) => {
  const { cuisineId } = req.params;
  const result = await updateCuisineService(req, cuisineId, req.body);

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
  getCuisineDropDown,
  updateCuisine,
  deleteCuisine
}

export default CuisineController;