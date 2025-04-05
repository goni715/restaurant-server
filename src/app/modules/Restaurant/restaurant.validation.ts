import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dining: z.array(objectIdSchema).min(1, "There must be at least one value"),
  location: z.string().min(1, "Location is required"),
  keywords: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  discount: z.string().optional(),
  payment: z.boolean().default(false),
  bookingFee: z.number().positive("bookingFee must be a positive number").optional(),
  cancellationPercentage: z.number().nonnegative().default(0)
})

export const updateRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  website: z.string().url("Invalid URL format").optional(),
  cuisine: z.string().min(1, "Cuisine is required").optional(),
  dining: z.array(objectIdSchema).optional(),
  location: z.string().min(1, "Location is required").optional(),
  keywords: z.array(z.string()).optional().optional(),
  features: z.array(z.string()).optional(),
  price: z.number().min(0, "Price must be at least 0").optional(),
  discount: z.string().optional(),
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

