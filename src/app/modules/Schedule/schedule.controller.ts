import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createScheduleService } from "./schedule.service";


const createSchedule = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
    const result = await createScheduleService(loginUserId as string, req.body);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule created successfully",
      data: result
    });
});


const ScheduleController = {
    createSchedule
};

export default ScheduleController;