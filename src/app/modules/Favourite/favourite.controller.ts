import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { FavoriteValidFields } from "./favourite.constant";
import { addOrRemoveFavouriteService, getFavouriteListService } from "./favourite.service";

const addOrRemoveFavourite = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { restaurantId } = req.body;
  const result = await addOrRemoveFavouriteService(loginUserId as string, restaurantId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message as string,
    data: result.data,
  });
});
  
  
  
const getFavouriteList = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, FavoriteValidFields);
    const result = await getFavouriteListService(loginUserId as string, validatedQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Favourite Restaurants are retrieved successfully",
      meta: result.meta,
      data: result.data
    });
});




const FavouriteController = {
   addOrRemoveFavourite,
   getFavouriteList
}

export default FavouriteController;