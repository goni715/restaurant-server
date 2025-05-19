import Stripe from "stripe";
import config from "../../config";
import { IPayment } from "./payment.interface";


const secretKey = config.stripe_secret_key as string;
const stripe = new Stripe(secretKey);
const createPaymentIntentService = async (reqBody: IPayment) => {
     const { amount } = reqBody; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

  return {
    clientSecret: paymentIntent.client_secret,
  };
}


export {
    createPaymentIntentService
}