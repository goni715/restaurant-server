import AppError from "../../errors/AppError";
import SocialMediaModel from "./socialMedia.model";
import { ISocialMedia } from "./socialMedia.interface";
import RestaurantModel from "../Restaurant/restaurant.model";


const createSocialMediaService = async (loginUserId:string, payload: ISocialMedia) => {
  //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ _id:payload.restaurantId, ownerId: loginUserId })
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }


  //check already social-media exist
  const socialMedia = await SocialMediaModel.findOne({ ownerId:loginUserId, restaurantId: payload.restaurantId });
  if (socialMedia) {
    throw new AppError(409, "Social Media is already exist");
  }

  const result = await SocialMediaModel.create({
    ...payload,
    ownerId: loginUserId
  })

  return result;
}

const getSocialMediaListService = async () => {
    const result = await SocialMediaModel.find();
    return result;
}

const updateSocialMediaService = async (loginUserId: string, payload: ISocialMedia) => {
   //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ _id:payload.restaurantId, ownerId: loginUserId })
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  const result = await SocialMediaModel.updateOne(
    { ownerId: loginUserId, restaurantId: payload.restaurantId},
    payload
  )

  return result;
}

const deleteSocialMediaService = async (loginUserId: string, restaurantId: string) => {
    //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ _id:restaurantId, ownerId: loginUserId })
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  const result = await SocialMediaModel.deleteOne({ restaurantId, ownerId: loginUserId })
  return result;
}

export {
    createSocialMediaService,
    getSocialMediaListService,
    updateSocialMediaService,
    deleteSocialMediaService
}