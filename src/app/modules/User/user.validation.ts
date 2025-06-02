import { z } from "zod";

// /^([A-Z][a-zA-Z'.\-]*\s?)+$/ => letter, each word capitalized, only contain letters, spaces, apostrophes, hyphens, and dots.
const fullNameRegex = /^[A-Za-z\s'.-]+$/; //only contain letters, spaces, apostrophes, hyphens, and dots

export const createUserValidationSchema = z.object({
  fullName: z.string({
    required_error: "full Name is required",
  })
  .trim()
  .regex(fullNameRegex, {
      message:
        "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    })
  ,
  email: z
    .string({
      required_error: "email is required",
    })
    .email(),
  phone: z.string({
    required_error: "phone number is required",
  }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .min(60, "Password maximum 6 characters long")
    .trim()
});


export const updateProfileValidationSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

