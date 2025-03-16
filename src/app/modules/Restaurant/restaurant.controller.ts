import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { RestaurantValidFields } from "./restaurant.interface";
import { changeRestaurantStatusService, createRestaurantService, getRestaurantsService, getSingleRestaurantService } from "./restaurant.service";



const createRestaurant = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createRestaurantService(loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 201,
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


const changeRestaurantStatus = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const { status } = req.body; 
  const result = await changeRestaurantStatusService(restaurantId, status);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Restaurant status is changed successfully",
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
    changeRestaurantStatus,
    getSingleRestaurant
}

export default RestaurantController;