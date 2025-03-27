import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createAdministratorService } from "./administrator.service";


const createAdministrator = catchAsync(async (req, res) => {
  const result = await createAdministratorService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Administrator is created successfully",
    data: result,
  });
});


const AdministratorController = {
    createAdministrator,
};
  
export default AdministratorController;