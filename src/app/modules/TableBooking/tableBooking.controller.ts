import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { TableBookingValidFields } from "./tableBooking.constant";
import { changeAvailabilityService, createTableBookingService, deleteTableBookingService, getTableBookingsByBookingIdService, getTableBookingsService } from "./tableBooking.service";


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

const getTableBookingsByBookingId = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { bookingId } = req.params;
  const result = await getTableBookingsByBookingIdService(loginUserId as string, bookingId);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Table Booking List retrieved successfully",
      data: result
    });
});

const changeAvailability = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { tableBookingId } = req.params;
  const result = await changeAvailabilityService(loginUserId as string, tableBookingId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Availability is updated successfully",
    data: result
  })
});


const deleteTableBooking = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { tableBookingId } = req.params;
  const result = await deleteTableBookingService(loginUserId as string, tableBookingId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Table is deleted successfully",
    data: result,
  });
});


const TableBookingController = {
    createTableBooking,
    getTableBookings,
    getTableBookingsByBookingId,
    changeAvailability,
    deleteTableBooking
};

export default TableBookingController;