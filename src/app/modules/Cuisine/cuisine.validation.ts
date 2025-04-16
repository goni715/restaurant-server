import { z } from "zod";



export const createCuisineValidationSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .trim(),
});

export const updateCuisineValidationSchema = z.object({
  name: z.string().trim().optional(),
});
