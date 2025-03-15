import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { RestaurantValidFields } from "./restaurant.interface";
import { createRestaurantService, getRestaurantsService } from "./restaurant.service";



const createRestaurant = catchAsync(async (req, res) => {
  const result = await createRestaurantService(req.body);
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


const RestaurantController = {
    createRestaurant,
    getRestaurants
}

export default RestaurantController;