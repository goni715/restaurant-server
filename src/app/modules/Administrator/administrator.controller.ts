import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { AdministratorValidFields } from "./administrator.constant";
import { createAdministratorService, deleteAdministratorService, getAdministratorsService, updateAdministratorService } from "./administrator.service";


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
    statusCode: 200,
    success: true,
    message: "Administrator is updated successfully",
    data: result,
  });
});


const getAdministrators = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, AdministratorValidFields);
  const result = await getAdministratorsService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Administrators are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});


const deleteAdministrator = catchAsync(async (req, res) => {
  const { administratorId } = req.params;
  const result = await deleteAdministratorService(administratorId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Administrator is deleted successfully",
    data: result,
  });
});

const AdministratorController = {
    createAdministrator,
    updateAdministrator,
    getAdministrators,
    deleteAdministrator
};
  
export default AdministratorController;