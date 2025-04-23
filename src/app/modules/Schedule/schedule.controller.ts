import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { ScheduleDropDownValidFields, ScheduleValidFields, UserScheduleValidFields } from "./schedule.constant";
import { createScheduleService, deleteScheduleService, getScheduleDropDownService, getSchedulesService, getSingleScheduleService, getUserSchedulesService } from "./schedule.service";


const createSchedule = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createScheduleService(loginUserId as string, req.body);
  
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Schedule created successfully",
      data: result
    });
});


const getSchedules = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, ScheduleValidFields);
  const result = await getSchedulesService(loginUserId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules are retrived successfully",
      meta: result.meta,
      data: result.data
    });
});

const getScheduleDropDown = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, ScheduleDropDownValidFields);
  const result = await getScheduleDropDownService(loginUserId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules are retrived successfully",
      data: result
    });
});

const getUserSchedules = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const validatedQuery = pickValidFields(req.query, UserScheduleValidFields);
  const result = await getUserSchedulesService(restaurantId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules are retrived successfully",
      meta: result.meta,
      data: result.data
    });
});


const getSingleSchedule = catchAsync(async (req, res) => {
  const { scheduleId } = req.params;
  const result = await getSingleScheduleService(scheduleId as string);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule is retrived successfully",
      data: result
    });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { scheduleId } = req.params;
  const result = await deleteScheduleService(loginUserId as string, scheduleId);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule is deleted successfully",
      data: result
    });
});

const ScheduleController = {
    createSchedule,
    getSchedules,
    getScheduleDropDown,
    getUserSchedules,
    getSingleSchedule,
    deleteSchedule
};

export default ScheduleController;