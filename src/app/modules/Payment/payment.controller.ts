import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createPaymentIntentService } from "./payment.service";


const createPaymentIntent = catchAsync(async (req, res) => {
  const result = await createPaymentIntentService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Intent is created successfully",
    data: result,
  });
});



const PaymentController = {
    createPaymentIntent
 }
 
 export default PaymentController;