import { Types } from "mongoose";
import { z } from "zod";

export const createNotificationValidationSchema = z.object({
  userId: z
    .string({
      required_error: "userId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "userId must be a valid ObjectId",
    }),
  title: z.string({
    required_error: "title is required",
  }),
  message: z.string({
    required_error: "message is required",
  }),
  type: z.enum(["info", "warning", "success", "error"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  })
  .default("info")
});
