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
  totalTable: z
    .number({
      invalid_type_error: "totalTable must be number",
      required_error: "totalTable is required",
    })
    .positive("seats must be a positive number"),
  seats: z
    .number({
      invalid_type_error: "seats must be number",
      required_error: "seats field required",
    })
    .positive("seats must be a positive number"),
});



export const updateTableValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "name must be string"
    })
    .regex(
      /^T-[1-9]\d*$/,
      "Name must be in the format 'T-1', 'T-2', ... (no T-0 or T-01)"
    )
    .optional(),
  seats: z
    .number({
     invalid_type_error: "seats must be number",
      required_error: "seats field required",
    })
    .min(0, "Seats cannot be negative")
    .optional(),
});

