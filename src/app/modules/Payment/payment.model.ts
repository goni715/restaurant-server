import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";



const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      trim:true
    },
    status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PaymentModel = model<IPayment>('Payment', paymentSchema);
export default PaymentModel;