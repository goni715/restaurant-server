import { Types } from "mongoose";
import { z } from "zod";


export const createBookingSchema = z.object({
  scheduleId: z
    .string({
      required_error: "scheduleId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "scheduleId must be a valid ObjectId",
    }),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1"),
  guest: z
    .number()
    .positive("Guest must be a positive number")
    .min(1, "guest must be at least 1"),
});
