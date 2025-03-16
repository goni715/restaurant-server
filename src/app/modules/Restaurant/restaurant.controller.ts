import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { RestaurantValidFields, UserRestaurantValidFields } from "./restaurant.interface";
import { approveRestaurantService, changeRestaurantStatusService, createRestaurantService, getOwnerRestaurantsService, getRestaurantsService, getSingleRestaurantService, getUserRestaurantsService } from "./restaurant.service";



const createRestaurant = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createRestaurantService(req, loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant is created successfully",
    data: result,
  });
});
  


const getRestaurants = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, RestaurantValidFields);
  const result = await getRestaurantsService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurants are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});



const getUserRestaurants = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, UserRestaurantValidFields);
  const result = await getUserRestaurantsService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurants are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});


const getOwnerRestaurants = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, RestaurantValidFields);
  const result = await getOwnerRestaurantsService(loginUserId as string, validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurants are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});


const changeRestaurantStatus = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const { status } = req.body; 
  const result = await changeRestaurantStatusService(restaurantId, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant status is changed successfully",
    data: result,
  });
});
 

const approveRestaurant = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const { approved } = req.body; 
  const result = await approveRestaurantService(restaurantId, approved);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant Approval is updated successfully",
    data: result,
  });
});


const getSingleRestaurant = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const result = await getSingleRestaurantService(restaurantId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant is retrieved successfully",
    data: result
  });
});


const RestaurantController = {
    createRestaurant,
    getRestaurants,
    getUserRestaurants,
    getOwnerRestaurants,
    changeRestaurantStatus,
    getSingleRestaurant,
    approveRestaurant
}

export default RestaurantController;