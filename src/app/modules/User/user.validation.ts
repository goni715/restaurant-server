import { z } from "zod";

export const createUserValidationSchema = z.object({
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
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .trim()
});


export const updateProfileValidationSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

