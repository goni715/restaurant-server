import { Types } from "mongoose";
import RestaurantModel from "../Restaurant/restaurant.model";
import AppError from "../../errors/AppError";


const addOrRemoveFavouriteService = async (
  loginUserId: string,
  restaurantId: string
) => {
  const ObjectId = Types.ObjectId;
  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }
  

  return {
    loginUserId,
    restaurantId,
  };



};


const getFavouriteListService = async ( loginUserId: string ) => {
    return "makeRemoveFavouriteService"
}



export {
    addOrRemoveFavouriteService,
    getFavouriteListService
}