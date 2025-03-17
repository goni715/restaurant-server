import { z } from "zod";


export const createRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.string().url("Invalid URL format").optional(),
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
  discount: z.string().optional()
});


export const updateRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  website: z.string().url("Invalid URL format").optional(),
  cuisine: z.string().min(1, "Cuisine is required").optional(),
  dining: z.string({
    required_error: "Dining Style is required"
  }).min(1, "Dining style is required").optional(),
  location: z.string().min(1, "Location is required").optional(),
  keywords: z.array(z.string()).optional().optional(),
  features: z.array(z.string()).optional(),
  price: z.number().min(0, "Price must be at least 0").optional(),
  discount: z.string().optional()
});


export const changeRestaurantStatusSchema = z.object({
  status: z.enum(["active", "deactive"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  })
});

export const approveRestaurantSchema = z.object({
  approved: z.enum(["pending", "accepted", "cancelled"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  })
});

