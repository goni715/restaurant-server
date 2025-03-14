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
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .trim()
});
