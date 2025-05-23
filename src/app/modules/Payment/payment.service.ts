import Stripe from "stripe";
import config from "../../config";
import { IPayment } from "./payment.interface";
import PaymentModel from "./payment.model";
import ObjectId from "../../utils/ObjectId";

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
};

const getTotalIncomeService = async (loginUserId: string) => {
  const result = await PaymentModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const total = result?.length > 0 ? result[0]?.total : 0;
  return {
    total
  };
};


/*

const getTotalIncomeService = async (loginUserId: string) => {
  const result = await PaymentModel.aggregate([
    {
      $match: {
        ownerId: new ObjectId(loginUserId),
      },
    },
    {
      $facet: {
        totalIncome: [
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ],
        lastTwelveMonths: [
          {
            $match: {
              createdAt: {
                $gte: new Date(
                  new Date().setFullYear(new Date().getFullYear() - 1)
                ),
              },
            },
          },
          // {
          //   $group: {
          //     _id: { $month: "$createdAt" },
          //     amount: { $sum: "$amount" },
          //   },
          // },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              amount: { $sum: "$amount" },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
          {
            $addFields: {
              month: {
                $arrayElemAt: [
                  [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id.month",
                ],
              },
            },
          },
          // {
          //   $addFields: {
          //     month: {
          //       $arrayElemAt: [
          //         [
          //           "",
          //           "Jan",
          //           "Feb",
          //           "Mar",
          //           "Apr",
          //           "May",
          //           "Jun",
          //           "Jul",
          //           "Aug",
          //           "Sep",
          //           "Oct",
          //           "Nov",
          //           "Dec",
          //         ],
          //         "$_id",
          //       ],
          //     },
          //   },
          // },
        ],
      },
    },
  ]);

  return result;
};

*/

export { createPaymentIntentService, getTotalIncomeService };
