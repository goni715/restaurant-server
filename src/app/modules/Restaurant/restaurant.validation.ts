import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // location: z.object({
  //   type: z.literal('Point'),
  //   coordinates: z
  //     .array(z.number())
  //     .length(2, 'Coordinates must contain exactly two numbers [longitude, latitude]'),
  // }),
 
  address: z.string({ required_error: "Address is required"}).min(1, "address is required !"),
  longitude: z.preprocess((val) => Number(val), z.number().min(-180, { message: "Longitude must be >= -180" }).max(180, { message: "Longitude must be <= 180" })),
  //latitude: z.preprocess((val) => Number(val), z.number().min(-90).max(90)),
  latitude: z.preprocess((val) => Number(val), z.number().min(-90, { message: "Longitude must be >= -90" }).max(90, { message: "Longitude must be <= 90" })),
  keywords: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  discount: z.string().optional(),
  // paymentRequired: z.preprocess(
  //   (val) => {
  //     if (val === "true" || val === true) return true;
  //     if (val === "false" || val === false) return false;
  //     return val; // fallback for invalid types
  //   },
  //   z.boolean()
  // ),
  paymentRequired: z.preprocess((val) => Boolean(val), z.boolean().default(false)),
  bookingFeePerguest: z.preprocess((val) => Number(val), z.number().nonnegative().default(0)).optional(),
  cancellationPercentage: z.preprocess((val) => Number(val), z.number().nonnegative().default(0)).optional()
})

export const updateRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  website: z.string().url("Invalid URL format").optional(),
  address: z.string().min(1, "Location is required").optional(),
  keywords: z.array(z.string()).optional().optional(),
  features: z.array(z.string()).optional(),
  discount: z.string().optional(),
  cancellationPercentage: z.number().nonnegative().default(0)
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

