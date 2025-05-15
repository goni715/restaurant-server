import { Types } from 'mongoose';
import { z } from 'zod';
export const createReservationValidationSchema = z.object({
  scheduleIds: z
    .array(
      z
        .string()
        .refine((id) => Types.ObjectId.isValid(id), {
          message: "Each scheduleId must be a valid ObjectId",
        })
    )
    .min(1, "At least one scheduleId is required"),
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
});
