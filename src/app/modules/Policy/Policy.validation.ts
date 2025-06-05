import { z } from "zod";

export const createPolicyValidationSchema = z.object({
  type: z.enum(["privacy-policy", "terms-condition", "about-us"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }),
  content: z
    .string()
    .min(1, { message: "Content must not be empty." })
    .refine(
      (val) =>
        /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/i.test(val.trim()) ||
        val.includes("<"),
      {
        message: "Content must be valid HTML.",
      }
    ),
});

export const updatePolicyValidationSchema = z.object({
  content: z
    .string({
      required_error: "Content is required!",
    })
    .min(1, { message: "Content must not be empty." })
    .refine(
      (val) =>
        /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/i.test(val.trim()) ||
        val.includes("<"),
      {
        message: "Content must be valid HTML.",
      }
    )
    .optional(),
});
