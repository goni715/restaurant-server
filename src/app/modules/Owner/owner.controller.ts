import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createOwnerService } from "./owner.service";

const createOwner = catchAsync(async (req, res) => {
  const result = await createOwnerService(req, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Owner is created successfully",
    data: result,
  });
});





const OwnerController = {
    createOwner
}

export default OwnerController;