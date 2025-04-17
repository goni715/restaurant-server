import { Types } from "mongoose";
import { z } from "zod";



export const createMenuValidationSchema = z.object({
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


export const updateMenuValidationSchema = z.object({
  cuisineId: z
    .string({
      required_error: "cuisineId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "cuisineId must be a valid ObjectId",
  }).optional(),
  name: z.string({
    required_error: "name is required",
  }).optional(),
  price: z
    .union([
      z.number(),
      z.string().transform((val) => Number(val)),
    ])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Price must be a number" })
    .refine((val) => val > 0, { message: "Price must be at least 1" })
    .optional(),
  ingredient: z.string({
    required_error: "ingredient is required",
  }).optional(),
});