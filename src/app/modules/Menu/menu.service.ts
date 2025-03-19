import AppError from "../../errors/AppError";
import CuisineModel from "../Cuisine/cuisine.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import { IMenu } from "./menu.interface"
import MenuModel from "./menu.model";



const createMenuService = async (loginUserId: string, payload: IMenu) => {
    const { restaurantId, cuisineId } = payload;
    //check cuisine is already existed
    const cuisine = await CuisineModel.findById(cuisineId);
    if (!cuisine) {
      throw new AppError(404, "This cuisine not found");
    }

    //check restaurant exist
    const restaurant = await RestaurantModel.findOne({
      _id: restaurantId,
      ownerId: loginUserId,
    });
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found");
    }


    //create the menu
    const result = await MenuModel.create({
        ...payload,
        ownerId: loginUserId
    })
    
    return result;
}


export {
    createMenuService
}