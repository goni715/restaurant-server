import { Types } from "mongoose";
import { z } from "zod";


export const socialMediaSchema = z.object({
  restaurantId: z
    .string({
      required_error: "restaurantId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "restaurantId must be a valid ObjectId",
  }),
  website: z.string().url().optional(),
  facebook: z.string().url().optional(),
  youtube: z.string().url().optional(),
  instagram: z.string().url().optional(),
  other: z.string().optional(),
});


