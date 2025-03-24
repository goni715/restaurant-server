import { Types } from "mongoose";
import { TPaymentStatus } from "../Booking/booking.interface";


export interface IPayment {
    bookingId: Types.ObjectId;
    amount: number;
    transactionId: string;
    status: TPaymentStatus;
    paymentGateWayData?: Object
}