import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { UserValidFields } from "./user.constant";
import { createUserService, editMyProfileService, getMeService, getSingleUserService, getUsersService, updateProfileImgService, } from "./user.service";


const createUser = catchAsync(async (req, res) => {
  const result = await createUserService(req, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User is created successfully",
    data: result
  })
})


const getUsers = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, UserValidFields);
  const result = await getUsersService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});



const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleUserService(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is retrieved successfully",
    data: result
  });
});



const getMe = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getMeService(loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Information is retrieved successfully",
    data: result
  });
});



const editMyProfile = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await editMyProfileService(loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile is updated successfully",
    data: result
  });
});



const updateProfileImg = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await updateProfileImgService(req, loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Image is updated successfully",
    data: result,
  });
});


const UserController = {
    createUser,
    getUsers,
    getSingleUser,
    getMe,
    editMyProfile,
    updateProfileImg
}

export default UserController;