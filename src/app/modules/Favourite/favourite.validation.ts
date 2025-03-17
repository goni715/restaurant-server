import { z } from "zod";
import { Types } from "mongoose";

export const addOrRemoveFavouriteSchema = z.object({
    restaurantId: z.string({
    required_error: "restaurantId is required!"
  }).refine((id) => Types.ObjectId.isValid(id), {
    message: "restaurantId must be a valid ObjectId",
  }),
});
