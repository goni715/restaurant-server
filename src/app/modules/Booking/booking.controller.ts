import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { BookingValidFields } from "./booking.constant";
import { createBookingWithoutPaymentService, createBookingWithPaymentService, getBookingsService, getMyBookingsService, getSingleBookingService, updateBookingStatusService } from "./booking.service";

const createBookingWithoutPayment = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createBookingWithoutPaymentService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking is created successfully",
    data: result,
  });
});


const createBookingWithPayment = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createBookingWithPaymentService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking is created successfully",
    data: result,
  });
});

const getBookings = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, BookingValidFields);
  const result = await getBookingsService(loginUserId as string, validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, BookingValidFields);
  const result = await getMyBookingsService(loginUserId as string, validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});



const updateBookingStatus = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { bookingId } = req.params;
  const { status } = req.body;
  const result = await updateBookingStatusService(loginUserId as string, bookingId, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "status is updated successfully",
    data: result,
  });
});


const getSingleBooking = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { bookingId } = req.params;
  const result = await getSingleBookingService(loginUserId as string, bookingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking is retrieved successfully",
    data: result,
  });
});

const BookingController = {
  createBookingWithoutPayment,
  createBookingWithPayment,
  getBookings,
  getMyBookings,
  updateBookingStatus,
  getSingleBooking
};

export default BookingController;