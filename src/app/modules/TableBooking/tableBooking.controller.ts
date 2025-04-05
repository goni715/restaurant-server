import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createTableBookingService } from "./tableBooking.service";


const createTableBooking = catchAsync(async (req, res) => {
    const loginUserId = req.headers.id;
    const result = await createTableBookingService(loginUserId as string, req.body);
    
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Table is booked successfully",
        data: result
      });
});


const TableBookingController = {
    createTableBooking
};

export default TableBookingController;