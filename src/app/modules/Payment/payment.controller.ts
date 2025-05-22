import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createPaymentIntentService, getTotalIncomeService } from "./payment.service";


const createPaymentIntent = catchAsync(async (req, res) => {
  const result = await createPaymentIntentService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Intent is created successfully",
    data: result,
  });
});


const getTotalIncome = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getTotalIncomeService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Total Income is created successfully",
    data: result,
  });
});


const PaymentController = {
    createPaymentIntent,
    getTotalIncome
 }
 
 export default PaymentController;