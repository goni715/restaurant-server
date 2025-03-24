import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { initPaymentService } from "./payment.service";


const initPayment = catchAsync(async (req, res) => {
  const result = await initPaymentService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment is initiated successfully",
    data: result,
  });
});



const PaymentController = {
    initPayment
 }
 
 export default PaymentController;