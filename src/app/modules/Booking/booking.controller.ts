import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { BookingValidFields } from "./booking.constant";
import { createBookingWithoutPaymentService, createBookingWithPaymentService, getBookingsService } from "./booking.service";

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

const BookingController = {
  createBookingWithoutPayment,
  createBookingWithPayment,
  getBookings
};

export default BookingController;