import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dining: z.array(objectIdSchema).min(1, "There must be at least one value"),
  // location: z.object({
  //   type: z.literal('Point'),
  //   coordinates: z
  //     .array(z.number())
  //     .length(2, 'Coordinates must contain exactly two numbers [longitude, latitude]'),
  // }),
  longitude: z.number().min(-180).max(180, { message: "Longitude must be between -180 and 180" }),
  latitude: z.number().min(-90).max(90, { message: "Latitude must be between -90 and 90" }),
  address: z.string({ required_error: "Address is required"}).min(1, "address is required !"),
  //longitude: z.preprocess((val) => Number(val), z.number().min(-180).max(180)),
 // latitude: z.preprocess((val) => Number(val), z.number().min(-90).max(90)),
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

