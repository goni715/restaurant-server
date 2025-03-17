import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { addOrRemoveFavouriteService, getFavouriteListService } from "./favourite.service";

const addOrRemoveFavourite = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { restaurantId } = req.body;
  const result = await addOrRemoveFavouriteService(loginUserId as string, restaurantId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restauant is made or removed successfully",
    data: result,
  });
});
  
  
  
const getFavouriteList = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
    const result = await getFavouriteListService(loginUserId as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User status is changed successfully",
      data: result,
    });
});




const FavouriteController = {
   addOrRemoveFavourite,
   getFavouriteList
}

export default FavouriteController;