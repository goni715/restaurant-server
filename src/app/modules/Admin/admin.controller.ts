import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createAdminService } from "./admin.service";

const createAdmin = catchAsync(async (req, res) => {
  const result = await createAdminService(req, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin is created successfully",
    data: result,
  });
});





const AdminController = {
    createAdmin
}

export default AdminController;