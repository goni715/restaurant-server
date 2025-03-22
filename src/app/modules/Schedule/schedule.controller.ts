import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createScheduleService } from "./schedule.service";


const createSchedule = catchAsync(async (req, res) => {
    const result = await createScheduleService();
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule is created successfully",
      data: result
    });
});


const ScheduleController = {
    createSchedule
};

export default ScheduleController;