import { Types } from "mongoose";
import { z } from "zod";
export const createReservationValidationSchema = z.object({
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
  seats: z
    .number({
      required_error: "Seats are required",
    })
    .positive("Seats must be a positive number")
    .min(1, "Seats must be at least 1"),
});

export const updateReservationValidationSchema = z.object({
  seats: z
    .number({
      required_error: "Seats are required",
    })
    .positive("Seats must be a positive number")
    .min(1, "Seats must be at least 1"),
  dinings: z
    .array(
      z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Each diningId must be a valid ObjectId",
      })
    )
    .min(1, "At least one diningId is required").optional()
});
