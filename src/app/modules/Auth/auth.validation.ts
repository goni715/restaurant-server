import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      invalid_type_error: "Password must be string",
      required_error: "Password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .max(60, "Password maximum 60 characters long")
    .trim(),
});

export const forgotPassSendOtpSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email address",
    })
    .trim(),
});

export const forgotPassVerifyOtpSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "Email is required",
    })
    .trim()
    .email({
      message: "Invalid email address",
    }),
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
      invalid_type_error: "email must be string",
      required_error: "Email is required",
    })
    .trim()
    .email({
      message: "Invalid email address",
    }),
  otp: z
    .string({
      required_error: "Otp is required",
    })
    .regex(/^\d{4}$/, "Otp must be a 6-digit number")
    .trim(),
  password: z
    .string({
      invalid_type_error: "Password must be string",
      required_error: "Password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .max(60, "Password maximum 60 characters long")
    .trim(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({
      invalid_type_error: "Current Password must be string",
      required_error: "Current Password is required",
    })
    .min(6, "Current Password minimum 6 characters long")
    .max(60, "Current Password maximum 60 characters long")
    .trim(),
  newPassword: z
    .string({
      invalid_type_error: "New Password must be string",
      required_error: "New Password is required",
    })
    .min(6, "New Password minimum 6 characters long")
    .max(60, "New Password maximum 60 characters long")
    .trim(),
});

export const changeStatusValidationSchema = z.object({
  status: z
    .string({
      invalid_type_error: `status must be 'blocked' or 'unblocked'`,
      required_error: "status is required",
    })
    .refine((val) => ["blocked", "unblocked"].includes(val), {
      message: `status must be 'blocked' or 'unblocked'`,
    }),
});

export const deleteAccountValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be string",
      required_error: "Password is required",
    })
    .min(6, "Password minimum 6 characters long")
    .max(60, "Password maximum 60 characters long")

    .trim(),
});

export const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
    required_error: "Refresh token is required !",
  }),
});
