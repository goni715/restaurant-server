import slugify from "slugify";
import AppError from "../../errors/AppError";
import DiningModel from "./socialMedia.model";
import { ISocialMedia } from "./socialMedia.interface";
import RestaurantModel from "../Restaurant/restaurant.model";


const createSocialMediaService = async (payload: ISocialMedia) => {
     //check restaurant exist
  const restaurant = await RestaurantModel.findById(payload.restaurantId);
  if (!restaurant) {
    throw new AppError(409, "Restaurant not found");
  }
}


const getSocialMediaListService = async () => {
    const result = await DiningModel.find().select('-createdAt -updatedAt').sort('-createdAt')
    return result;
}

const updateSocialMediaService = async (DiningId: string, name: string) => {
    const Dining = await DiningModel.findById(DiningId)
    if(!Dining){
        throw new AppError(404, 'This quisine not found');
    }

    const slug = slugify(name).toLowerCase();
    const DiningExist = await DiningModel.findOne({ _id: { $ne: DiningId }, slug })
    if(DiningExist){
        throw new AppError(409, 'Sorry! This quisine name is already taken');
    }

    const result = await DiningModel.updateOne(
        { _id: DiningId},
        {
            name,
            slug
        }
    )

    return result;
}

const deleteSocialMediaService = async (DiningId: string) => {
    const Dining = await DiningModel.findById(DiningId)
    if(!Dining){
        throw new AppError(404, 'This quisine not found');
    }

    const result = await DiningModel.deleteOne({ _id: DiningId})
    return result;
}

export {
    createSocialMediaService,
    getSocialMediaListService,
    updateSocialMediaService,
    deleteSocialMediaService
}