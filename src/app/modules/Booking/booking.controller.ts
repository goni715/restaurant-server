import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createBookingService } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createBookingService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking is created successfully",
    data: result,
  });
});


const BookingController = {
  createBooking,
};

export default BookingController;