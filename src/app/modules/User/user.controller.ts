import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { UserValidFields } from "./user.constant";
import { createUserService, getUsersService, } from "./user.service";


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





const UserController = {
    createUser,
    getUsers
}

export default UserController;