import { Types } from "mongoose";
import { z } from "zod";



export const createMenuValidationSchema = z.object({
  restaurantId: z
    .string({
      required_error: "restaurantId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "restaurantId must be a valid ObjectId",
  }),
  cuisineId: z
    .string({
      required_error: "cuisineId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "cuisineId must be a valid ObjectId",
  }),
  name: z.string({
    required_error: "name is required",
  }),
  price: z.number().positive("Price must be a positive number").min(0, "Price must be at least 0"),
  ingredient: z.string({
    required_error: "ingredient is required",
  }),
});
