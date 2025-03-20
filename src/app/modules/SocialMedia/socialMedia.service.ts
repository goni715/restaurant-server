import AppError from "../../errors/AppError";
import SocialMediaModel from "./socialMedia.model";
import { ISocialMedia } from "./socialMedia.interface";
import RestaurantModel from "../Restaurant/restaurant.model";


const createSocialMediaService = async (loginUserId:string, payload: ISocialMedia) => {
  //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ ownerId: loginUserId })
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  //check already social-media exist
  const socialMedia = await SocialMediaModel.findOne({ ownerId:loginUserId, restaurantId: restaurant._id });
  if (socialMedia) {
    throw new AppError(409, "Social Media is already exist");
  }

  const result = await SocialMediaModel.create({
    ...payload,
    ownerId: loginUserId,
    restaurantId: restaurant._id
  })

  return result;
}



const getSocialMediaService = async (loginUserId: string) => {
  //check social-media not found
  const socialMedia = await SocialMediaModel.findOne({
    ownerId: loginUserId
  });
  if (!socialMedia) {
    throw new AppError(404, "Social Media not found");
  }

  return socialMedia
}




const updateSocialMediaService = async (loginUserId: string, payload: ISocialMedia) => {
   //check restaurant exist
  const restaurant = await RestaurantModel.findOne({ ownerId: loginUserId })
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  //check social-media not found
  const socialMedia = await SocialMediaModel.findOne({ ownerId:loginUserId, restaurantId: restaurant._id });
  if (!socialMedia) {
    throw new AppError(404, "Social Media not found");
  }

  const result = await SocialMediaModel.updateOne(
    { ownerId: loginUserId, restaurantId: restaurant._id},
    payload
  )

  return result;
}



const deleteSocialMediaService = async (loginUserId: string) => {
  //check social-media not found
  const socialMedia = await SocialMediaModel.findOne({
    ownerId: loginUserId
  });
  if (!socialMedia) {
    throw new AppError(404, "Social Media not found");
  }
  const result = await SocialMediaModel.deleteOne({ ownerId: loginUserId });
  return result;
}

export {
    createSocialMediaService,
    getSocialMediaService,
    updateSocialMediaService,
    deleteSocialMediaService
}