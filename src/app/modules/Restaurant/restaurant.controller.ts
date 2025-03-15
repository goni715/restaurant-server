import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createRestaurantService } from "./restaurant.service";



const createRestaurant = catchAsync(async (req, res) => {
  const result = await createRestaurantService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Restaurant is created successfully",
    data: result,
  });
});
  



const RestaurantController = {
    createRestaurant
}

export default RestaurantController;