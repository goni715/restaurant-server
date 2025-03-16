import { z } from "zod";


export const createRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.string().url("Invalid URL format"),
  cuisine: z.string().min(1, "Cuisine is required"),
  dining: z.string({
    required_error: "Dining Style is required"
  }).min(1, "Dining style is required"),
  location: z.string().min(1, "Location is required"),
  keywords: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  ratings: z
    .number()
    .min(0, "Ratings must be at least 0")
    .max(5, "Ratings can't exceed 5")
    .optional(),
  price: z.number().min(0, "Price must be at least 0"),
  cancellationCharge: z.number().min(0, "Price must be at least 0"),
  discount: z.string().optional()
});



export const changeRestaurantStatusSchema = z.object({
  status: z.enum(["active", "deactive"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  })
});


