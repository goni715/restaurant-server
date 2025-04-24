import { Types } from "mongoose";
import { z } from "zod";

export const createTableValidationSchema = z.object({
  scheduleId: z
    .string({
      required_error: "scheduleId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "scheduleId must be a valid ObjectId",
    }),
  diningId: z
    .string({
      required_error: "diningId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "diningId must be a valid ObjectId",
    }),
  totalTable: z.number().positive("seats must be a positive number"),
  seats: z.number().positive("seats must be a positive number"),
});



export const updateTableValidationSchema = z.object({
  seats: z
    .number({
      required_error: "Seats is required",
      invalid_type_error: "Seats must be a number",
    })
    .min(0, "Seats cannot be negative"),
});

