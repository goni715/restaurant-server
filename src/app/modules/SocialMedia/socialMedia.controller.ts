import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createSocialMediaService, deleteSocialMediaService, getSocialMediaListService, updateSocialMediaService } from "./socialMedia.service";


const createSocialMedia = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createSocialMediaService(loginUserId as string, req.body);

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
    message: "Social Media are retrived successfully",
    data: result
  });
});


const updateSocialMedia = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await updateSocialMediaService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social Media is updated successfully",
    data: result
  });
});


const deleteSocialMedia = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { restaurantId } = req.params;
  const result = await deleteSocialMediaService(loginUserId as string, restaurantId);

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