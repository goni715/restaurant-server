import { Schema } from "zod";
import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { ScheduleDropDownValidFields, ScheduleValidFields, UserScheduleValidFields } from "./schedule.constant";
import { createScheduleService, deleteScheduleService, getScheduleDropDownService, getSchedulesByDateService, getSchedulesService, getSingleScheduleService, getUserSchedulesService } from "./schedule.service";
import { getUserReservationsByDateService } from "../Reservation/Reservation.service";


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
      message: "Schedules are retrieved successfully",
      meta: result.meta,
      data: result.data
    });
});

const getSchedulesByDate = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, ScheduleValidFields);
  const result = await getSchedulesByDateService(loginUserId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules are retrieved successfully",
      data: result
    });
});

const getScheduleDropDown = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, ScheduleDropDownValidFields);
  const result = await getScheduleDropDownService(loginUserId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules are retrieved successfully",
      data: result
    });
});

const getUserSchedules = catchAsync(async (req, res) => {
  const { restaurantId, date } = req.params;
  const result = await getUserReservationsByDateService(restaurantId, date);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules are retrived successfully",
      data: result
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
    getSchedulesByDate,
    getScheduleDropDown,
    getUserSchedules,
    getSingleSchedule,
    deleteSchedule
};

export default ScheduleController;