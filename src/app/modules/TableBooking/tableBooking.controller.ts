import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { TableBookingValidFields } from "./tableBooking.constant";
import { createTableBookingService, getTableBookingsService } from "./tableBooking.service";


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

const getTableBookings = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, TableBookingValidFields);
  const result = await getTableBookingsService(loginUserId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Table Booking List retrieved successfully",
      meta: result.meta,
      data: result.data
    });
});


const TableBookingController = {
    createTableBooking,
    getTableBookings
};

export default TableBookingController;