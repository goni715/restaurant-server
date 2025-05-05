import { Types } from "mongoose";
import { z } from "zod";

export const createTableBookingSchema = z.object({
  bookingId: z
  .string({
    required_error: "bookingId is required!",
  })
  .refine((id) => Types.ObjectId.isValid(id), {
    message: "bookingId must be a valid ObjectId",
  }),
  tableId: z
    .string({
      required_error: "tableId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "tableId must be a valid ObjectId",
    })
});

export const changeAvailibilitySchema = z.object({
  availability: z
    .enum(["Seating","Waitlist"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
    }),
});