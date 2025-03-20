import slugify from "slugify";
import AppError from "../../errors/AppError";
import CuisineModel from "../Cuisine/cuisine.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import { IMenu } from "./menu.interface"
import MenuModel from "./menu.model";
import { Request } from "express";
import { Types } from "mongoose";



const createMenuService = async (req:Request, loginUserId: string, payload: IMenu) => {
    const { cuisineId, name } = payload;
    const slug = slugify(name).toLowerCase();

    //check cuisine not found
    const cuisine = await CuisineModel.findById(cuisineId);
    if (!cuisine) {
      throw new AppError(404, "This cuisine not found");
    }

    //check restaurant not found
    const restaurant = await RestaurantModel.findOne({
      ownerId: loginUserId
    });
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found");
    }


    //check menu already existed
    const menu = await MenuModel.findOne({
      ownerId: loginUserId,
      restaurantId: restaurant._id,
      cuisineId,
      slug
    });

    if(menu) {
      throw new AppError(409, "Menu is already existed");
    }

    
    
    if (!req.file) {
      throw new AppError(400, "image is required");
    }
    let image="";
    if (req.file) {
      //for local machine file path
      image = `${req.protocol}://${req.get("host")}/uploads/${ req.file.filename}`; //for local machine
    }

    //create the menu
    const result = await MenuModel.create({
        ...payload,
        ownerId: loginUserId,
        restaurantId: restaurant._id,
        image,
        slug
    })
    
    return result;
}


const getMenusService = async (restaurantId:string) => {
  const ObjectId = Types.ObjectId;
  const menus = await MenuModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId)}
    }
  ])

  return menus;
}


export {
    createMenuService,
    getMenusService
}