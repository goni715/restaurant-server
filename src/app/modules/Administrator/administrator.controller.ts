import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createAdministratorService } from "./administrator.service";


const createAdministrator = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createAdministratorService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking is created successfully",
    data: result,
  });
});


const AdministratorController = {
    createAdministrator,
};
  
export default AdministratorController;