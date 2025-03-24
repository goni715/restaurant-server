import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";



const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
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