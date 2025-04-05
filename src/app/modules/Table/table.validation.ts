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
  name: z.string({
    required_error: "name is required",
  }),
  seats: z.number().positive("seats must be a positive number"),
});
