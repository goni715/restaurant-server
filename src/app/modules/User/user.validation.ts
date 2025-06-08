import { z } from "zod";

// /^([A-Z][a-zA-Z'.\-]*\s?)+$/ => letter, each word capitalized, only contain letters, spaces, apostrophes, hyphens, and dots.
export const fullNameRegex = /^[A-Za-z\s'.-]+$/; //only contain letters, spaces, apostrophes, hyphens, and dots

export const createUserValidationSchema = z.object({
  fullName: z.string({
    invalid_type_error: "Full Name must be string",
    required_error: "full Name is required",
  })
  .trim()
  .regex(fullNameRegex, {
      message:
        "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }),
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    })
    .trim()
    .email({
       message: "Invalid email address"
    }),
  phone: z.string({
    required_error: "phone number is required",
  }),
  password: z
    .string({
      invalid_type_error: "password must be string",
      required_error: "password is required",
    })
    .trim()
    .min(6, "Password minimum 6 characters long")
    .max(60, "Password maximum 60 characters long")
});


export const updateProfileValidationSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

