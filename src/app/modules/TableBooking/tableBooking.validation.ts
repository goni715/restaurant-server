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
  guest: z
    .number()
    .positive("Guest must be a positive number")
    .min(1, "guest must be at least 1"),
});