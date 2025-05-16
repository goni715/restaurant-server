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
    }),
  guest: z
    .number({
      required_error: "Guest is required",
      invalid_type_error: "Guest must be a number",
    })
    .min(0, "Guest cannot be negative")
    .optional(),
});

export const changeAvailibilitySchema = z.object({
  availability: z
    .enum(["Seating","Waitlist"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
    }),
});