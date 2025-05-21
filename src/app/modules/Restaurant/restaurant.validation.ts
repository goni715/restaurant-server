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
  features: z.preprocess((val) => {
    if(typeof val === "string"){
      return [val.toString()]
    }
     if (Array.isArray(val)) {
      return val;
    }
    return []
  }, z.array(z.string()).min(1, { message: "At least one feature is required" })),
  //features: z.array(z.string()).min(1, { message: "At least one feature is required" }),
  discount: z.string().optional(),
  paymentRequired: z.preprocess(
    (val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return val; // fallback for invalid types
    },
    z.boolean().default(false)
  ),
  bookingFeePerGuest: z.preprocess((val) => Number(val), z.number().nonnegative().default(0)).optional(),
  cancellationPercentage: z.preprocess((val) => Number(val), z.number().nonnegative().default(0)).optional()
})

export const updateRestaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  address: z.string().min(1, "Location is required").optional(),
  features: z.array(z.string()),
  discount: z.string().optional(),
  longitude: z.preprocess((val) => Number(val), z.number().min(-180, { message: "Longitude must be >= -180" }).max(180, { message: "Longitude must be <= 180" }).optional()).optional(),
  latitude: z.preprocess((val) => Number(val), z.number().min(-90, { message: "Longitude must be >= -90" }).max(90, { message: "Longitude must be <= 90" }).optional()).optional(),
  paymentRequired: z.boolean().optional(),
  bookingFeePerGuest: z.number().nonnegative().optional(),
  cancellationPercentage: z.number().nonnegative().optional()
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

