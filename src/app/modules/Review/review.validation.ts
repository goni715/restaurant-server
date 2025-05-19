import { Types } from "mongoose";
import { z } from "zod";

export const createReviewValidationSchema = z.object({
   bookingId: z
    .string({
      required_error: "bookingId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "bookingId must be a valid ObjectId",
    }),
  restaurantId: z
    .string({
      required_error: "restaurantId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "restaurantId must be a valid ObjectId",
    }),
  star: z
    .number()
    .min(0.5, { message: "Rating must be at least 0" }) // Minimum rating is 0
    .max(5, { message: "Rating must not exceed 5" }) // Maximum rating is 5
    .refine((val) => val % 0.5 === 0, {
      message: "Rating must be in increments of 0.5",
    }),
  comment: z.string({
    required_error: "Comment is required",
  }),
});
