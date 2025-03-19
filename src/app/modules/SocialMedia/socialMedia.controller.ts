import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createSocialMediaService, deleteSocialMediaService, getSocialMediaListService, updateSocialMediaService } from "./socialMedia.service";


const createSocialMedia = catchAsync(async (req, res) => {
  const result = await createSocialMediaService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social Media is created successfully",
    data: result
  });
});



const getSocialMediaList = catchAsync(async (req, res) => {
  const result = await getSocialMediaListService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social Medias are retrived successfully",
    data: result
  });
});


const updateSocialMedia = catchAsync(async (req, res) => {
  const { diningId } = req.params;
  const { name } = req.body;
  const result = await updateSocialMediaService(diningId, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social Media is updated successfully",
    data: result
  });
});


const deleteSocialMedia = catchAsync(async (req, res) => {
  const { diningId } = req.params;
  const result = await deleteSocialMediaService(diningId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social Media is deleted successfully",
    data: result
  });
});


const SocialMediaController = {
  createSocialMedia,
  getSocialMediaList,
  updateSocialMedia,
  deleteSocialMedia
}

export default SocialMediaController;