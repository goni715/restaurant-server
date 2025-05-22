import { Types } from "mongoose";
import { TPaymentStatus } from "../Booking/booking.interface";


export interface IPayment {
    ownerId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    bookingId: Types.ObjectId;
    transactionId: string;
    amount: number;
    status: TPaymentStatus;
}