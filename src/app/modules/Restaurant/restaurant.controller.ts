import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { NearbyValidFields, RestaurantValidFields, UserRestaurantValidFields } from "./restaurant.constant";
import { approveRestaurantService, changeRestaurantStatusService, createRestaurantService, deleteRestaurantService, findNearbyRestaurantsService, getOwnerRestaurantService, getRestaurantsService, getSingleRestaurantService, getUserRestaurantsService, updateRestaurantImgService, updateRestaurantService } from "./restaurant.service";



const createRestaurant = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createRestaurantService(req, loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Restaurant is created successfully",
    data: result
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

const findNearbyRestaurants = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, NearbyValidFields);
  const result = await findNearbyRestaurantsService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurants are retrieved successfully",
    data: result
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


const getOwnerRestaurant = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getOwnerRestaurantService(loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant is retrieved successfully",
    data: result
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





const changeRestaurantStatus = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const result = await changeRestaurantStatusService(restaurantId, req.body);
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


const updateRestaurant = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await updateRestaurantService(loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant is updated successfully",
    data: result,
  });
});



const updateRestaurantImg = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await updateRestaurantImgService(req, loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant's image is updated successfully",
    data: result,
  });
});


const deleteRestaurant = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await deleteRestaurantService(loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant is deleted successfully",
    data: result,
  });
});



const RestaurantController = {
    createRestaurant,
    getRestaurants,
    getUserRestaurants,
    getOwnerRestaurant,
    changeRestaurantStatus,
    getSingleRestaurant,
    findNearbyRestaurants,
    approveRestaurant,
    updateRestaurant,
    updateRestaurantImg,
    deleteRestaurant
}

export default RestaurantController;