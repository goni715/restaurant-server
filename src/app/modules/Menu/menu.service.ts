import slugify from "slugify";
import AppError from "../../errors/AppError";
import CuisineModel from "../Cuisine/cuisine.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import { IMenu } from "./menu.interface"
import MenuModel from "./menu.model";



const createMenuService = async (loginUserId: string, payload: IMenu) => {
    const { restaurantId, cuisineId, name } = payload;
    const slug = slugify(name).toLowerCase();

    //check cuisine not found
    const cuisine = await CuisineModel.findById(cuisineId);
    if (!cuisine) {
      throw new AppError(404, "This cuisine not found");
    }

    //check restaurant not found
    const restaurant = await RestaurantModel.findOne({
      _id: restaurantId,
    });
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found");
    }


    //check restaurant not found
    const myRestaurant = await RestaurantModel.findOne({
      _id: restaurantId,
      ownerId: loginUserId,
    });
    if (!myRestaurant) {
      throw new AppError(404, "This is not your restaurant");
    }


    //check menu already existed
    const menu = await MenuModel.findOne({ ownerId: loginUserId, restaurantId, cuisineId, slug});
    if (menu) {
      throw new AppError(409, "Menu is already existed");
    }

    //create the menu
    const result = await MenuModel.create({
        ...payload,
        ownerId: loginUserId,
        slug
    })
    
    return result;
}


const getMenusService = async (loginUserId: string, restaurantId:string) => {
  return {
    loginUserId,
    restaurantId
  }
}


export {
    createMenuService,
    getMenusService
}