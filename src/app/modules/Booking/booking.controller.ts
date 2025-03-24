import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createBookingWithoutPaymentService, createBookingWithPaymentService } from "./booking.service";

const createBookingWithoutPayment = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createBookingWithoutPaymentService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 200,
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

const BookingController = {
  createBookingWithoutPayment,
  createBookingWithPayment
};

export default BookingController;