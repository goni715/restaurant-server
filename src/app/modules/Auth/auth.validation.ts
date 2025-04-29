import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .trim(),
});

export const forgotPassSendOtpSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email()
    .trim(),
});

export const forgotPassVerifyOtpSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email()
    .trim(),

  otp: z
    .string({
      required_error: "Otp is required",
    })
    .regex(/^\d{4}$/, "Otp must be a 6-digit number")
    .trim(),
});

export const forgotPassCreateNewPassSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email()
    .trim(),
  otp: z
    .string({
      required_error: "Otp is required",
    })
    .regex(/^\d{4}$/, "Otp must be a 6-digit number")
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .trim(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: "Current Password is required",
    })
    .min(6, "CurrePassword minimum 6 characters long")
    .trim(),
  newPassword: z
    .string({
      required_error: "New Password is required",
    })
    .min(6, "New Password minimum 6 characters long")
    .trim(),
});

export const changeStatusValidationSchema = z.object({
  status: z.enum(["blocked", "unblocked"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }),
});

export const deleteAccountValidationSchema = z.object({
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .trim(),
});

export const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
    required_error: "Refresh token is required !",
  }),
});
