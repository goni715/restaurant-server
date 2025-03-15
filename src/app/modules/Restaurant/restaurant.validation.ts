import { Types } from "mongoose";
import { z } from "zod";


export const createOwnerValidationSchema = z.object({
  fullName: z.string({
    required_error: "full Name is required",
  }),
  email: z
    .string({
      required_error: "email is required",
    })
    .email(),
  phone: z.string({
    required_error: "phone number is required",
  }),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }),
  address: z.string({
    required_error: "address is required",
  }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .trim(),
});



export const restaurantValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.string().url("Invalid URL format"),
  cuisine: z.string().min(1, "Cuisine is required"),
  diningStyle: z.string().min(1, "Dining style is required"),
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


export const createRestaurantValidationSchema = z.object({
    ownerData: createOwnerValidationSchema,
    restaurantData: restaurantValidationSchema
})