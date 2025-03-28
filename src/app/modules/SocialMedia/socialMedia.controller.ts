import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createSocialMediaService, deleteSocialMediaService, getSocialMediaService, updateSocialMediaService } from "./socialMedia.service";


const createSocialMedia = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createSocialMediaService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Social Media is created successfully",
    data: result
  });
});



const getSocialMedia = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getSocialMediaService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social Media is retrived successfully",
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
  const result = await deleteSocialMediaService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social Media is deleted successfully",
    data: result
  });
});


const SocialMediaController = {
  createSocialMedia,
  getSocialMedia,
  updateSocialMedia,
  deleteSocialMedia
}

export default SocialMediaController;