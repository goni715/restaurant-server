import { Types } from "mongoose";
import RestaurantModel from "../Restaurant/restaurant.model";
import AppError from "../../errors/AppError";
import FavouriteModel from "./favourite.model";


const addOrRemoveFavouriteService = async (
  loginUserId: string,
  restaurantId: string
) => {
  const ObjectId = Types.ObjectId;

  //check restaurant not exist
  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  //cheack restaurant is already existed or not existed
  const favourite = await FavouriteModel.findOne({
    userId: loginUserId,
    restaurantId
  })

  
  let result;
  let message;

  //if exist, remove it
  if(favourite){
    result = await FavouriteModel.deleteOne({ _id: new ObjectId(favourite._id) })
    message = "Restaurant has been removed from your favorite list successfully."
  }


   //if not exist, create a new one
   if(!favourite){
    result = await FavouriteModel.create({
        userId: loginUserId,
        restaurantId
    })
    message = "Restaurant has been added to your favorite list successfully."
   }

   
   return {
      message,
      data: result
   }
 
};


const getFavouriteListService = async ( loginUserId: string ) => {
    const ObjectId = Types.ObjectId;
    const result = await FavouriteModel.aggregate([
        {
            $match: { userId: new ObjectId(loginUserId) }
        }
    ])

    return result;
}



export {
    addOrRemoveFavouriteService,
    getFavouriteListService
}