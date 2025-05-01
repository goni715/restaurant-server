import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { DiningValidFields } from "./dining.constant";
import { createDiningService, deleteDiningService, getDiningDropDownService, getDiningListService, getMyDiningsService, updateDiningService } from "./dining.service";


const createDining = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const {name } = req.body;
  const result = await createDiningService(loginUserId as string, name);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Dining is created successfully",
    data: result
  });
});



const getDiningList = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, DiningValidFields);
  const result = await getDiningListService(loginUserId as string, validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dinings are retrived successfully",
    meta: result.meta,
    data: result.data
  });
});

const getDiningDropDown = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getDiningDropDownService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dinings are retrived successfully",
    data: result
  });
});

const getMyDinings = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getMyDiningsService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dinings are retrived successfully",
    data: result
  });
});


const updateDining = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { diningId } = req.params;
  const { name } = req.body;
  const result = await updateDiningService(loginUserId as string, diningId, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dining is updated successfully",
    data: result
  });
});


const deleteDining = catchAsync(async (req, res) => {
  const { diningId } = req.params;
  const result = await deleteDiningService(diningId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dining is deleted successfully",
    data: result
  });
});


const DiningController = {
  createDining,
  getDiningList,
  getDiningDropDown,
  getMyDinings,
  updateDining,
  deleteDining
}

export default DiningController;