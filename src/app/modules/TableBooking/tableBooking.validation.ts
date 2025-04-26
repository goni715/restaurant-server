import { Types } from "mongoose";
import { z } from "zod";

export const createTableBookingSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .trim(),
  tableId: z
    .string({
      required_error: "tableId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "tableId must be a valid ObjectId",
    }),
  token: z
    .string({
      required_error: "Token is required",
    })
    .regex(/^\d{6}$/, "Token must be a 6-digit number")
    .trim(),
  guest: z
    .number()
    .positive("Guest must be a positive number")
    .min(1, "guest must be at least 1"),
  // availability: z
  //   .enum(["Immediate Seating", "Booked", "Completed", "Waitlist"], {
  //     errorMap: () => ({ message: "{VALUE} is not supported" }),
  //   })
  //   .optional(),
});
