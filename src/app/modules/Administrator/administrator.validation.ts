import { z } from "zod";
import { VALID_ACCESS_VALUES } from "./administrator.constant";


export const createAdministratorSchema = z.object({
  administratorData: z.object({
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
      .optional(),
  }),
  access: z.array(z.enum(VALID_ACCESS_VALUES)).min(1, "There must be at least one value"),
});
