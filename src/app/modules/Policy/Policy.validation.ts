import { z } from "zod";

export const createPolicyValidationSchema = z.object({
  type: z.enum(["privacy-policy", "terms-condition", "about-us"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }),
  content: z.string({
    required_error: "content is required !",
  }),
});

export const updatePolicyValidationSchema = z.object({
  type: z
    .enum(["privacy-policy", "terms-condition", "about-us"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
    .optional(),
  content: z
    .string({
      required_error: "content is required !",
    })
    .optional(),
});
