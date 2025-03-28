import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createAdministratorService, updateAdministratorService } from "./administrator.service";


const createAdministrator = catchAsync(async (req, res) => {
  const result = await createAdministratorService(req, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Administrator is created successfully",
    data: result,
  });
});


const updateAdministrator = catchAsync(async (req, res) => {
  const { administratorId } = req.params;
  const { access } = req.body;
  const result = await updateAdministratorService(administratorId, access);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Administrator is updated successfully",
    data: result,
  });
});


const AdministratorController = {
    createAdministrator,
    updateAdministrator
};
  
export default AdministratorController;