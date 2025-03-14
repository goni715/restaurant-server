import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { UserValidFields } from "./user.constant";
import { createUserService, getSuggestedUsersService } from "./user.service";


const createUser = catchAsync(async (req, res) => {
  const result = await createUserService(req, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User is created successfully",
    data: result
  })
})


const getSuggestedUsers = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, UserValidFields);
  const result = await getSuggestedUsersService(loginUserId as string, validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Suggested Users are retrieved successfully",
    data: result
  });
});





const UserController = {
    createUser
}

export default UserController;