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
