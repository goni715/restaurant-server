import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import PaymentController from "./payment.controller";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { createPaymentIntentSchema } from "./payment.validation";

const router = express.Router();

router.post("/create-payment-intent", AuthMiddleware("user"), validationMiddleware(createPaymentIntentSchema), PaymentController.createPaymentIntent);


const PaymentRoutes = router;
export default PaymentRoutes;