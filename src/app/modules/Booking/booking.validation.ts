import { Types } from "mongoose";
import { z } from "zod";

const checkInTimeSchema = z
  .string({
    required_error: "Please select checkIn Time",
  })
  .min(1, { message: "Please select checkOut Time" })
  .refine(
    (value) => {
      const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
      return regex.test(value); //return true or false
    },
    {
      message: 'Invalid time format , expected "HH:MM" in 24 hours format',
    }
  );


const checkOutTimeSchema = z
  .string({
    required_error: "Please select Check Out Time",
  })
  .min(1, { message: "Please select Check Out Time" })
  .refine(
    (value) => {
      const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
      return regex.test(value); //return true or false
    },
    {
      message: 'Invalid time format , expected "HH:MM" in 24 hours format',
    }
  );



export const createBookingWithoutPaymentSchema = z
  .object({
    date: z
      .string({
        required_error: "Date is required !",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date must be in YYYY-MM-DD format",
      })
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        { message: "Invalid date" }
      ),
    checkIn: checkInTimeSchema,
    checkOut: checkOutTimeSchema,
    diningId: z
      .string({
        required_error: "diningId is required!",
      })
      .refine((id) => Types.ObjectId.isValid(id), {
        message: "diningId must be a valid ObjectId",
      }),
    restaurantId: z
      .string({
        required_error: "restaurantId is required!",
      })
      .refine((id) => Types.ObjectId.isValid(id), {
        message: "restaurantId must be a valid ObjectId",
      }),
    guest: z
      .number()
      .positive("Guest must be a positive number")
      .min(1, "guest must be at least 1"),
  })
  .superRefine((values, ctx) => {
    const { checkIn, checkOut } = values;

    // Create Date objects using the provided startTime and endTime
    const start = new Date(`2024-01-01T${checkIn}:00`);
    const end = new Date(`2024-01-01T${checkOut}:00`);

    if (end <= start) {
      // Set the error on the `endTime` field
      ctx.addIssue({
        path: ["checkOut"],
        message: "checkOut time must be later than checkIn time!",
        code: z.ZodIssueCode.custom,
      });

      // Alternatively, you could set the error on `startTime`
      ctx.addIssue({
        path: ["checkIn"],
        message: "checkIn time must be before checkOut time!",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const createBookingWithPaymentSchema = z
  .object({
    date: z
      .string({
        required_error: "Date is required !",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date must be in YYYY-MM-DD format",
      })
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        { message: "Invalid date" }
      ),
    checkIn: checkInTimeSchema,
    checkOut: checkOutTimeSchema,
    diningId: z
      .string({
        required_error: "diningId is required!",
      })
      .refine((id) => Types.ObjectId.isValid(id), {
        message: "diningId must be a valid ObjectId",
      }),
    restaurantId: z
      .string({
        required_error: "restaurantId is required!",
      })
      .refine((id) => Types.ObjectId.isValid(id), {
        message: "restaurantId must be a valid ObjectId",
      }),
    amount: z.number().positive("amount must be positive number"),
    guest: z
      .number()
      .positive("Guest must be a positive number")
      .min(1, "guest must be at least 1"),
  })
  .superRefine((values, ctx) => {
    const { checkIn, checkOut } = values;

    // Create Date objects using the provided startTime and endTime
    const start = new Date(`2024-01-01T${checkIn}:00`);
    const end = new Date(`2024-01-01T${checkOut}:00`);

    if (end <= start) {
      // Set the error on the `endTime` field
      ctx.addIssue({
        path: ["checkOut"],
        message: "checkOut time must be later than checkIn time!",
        code: z.ZodIssueCode.custom,
      });

      // Alternatively, you could set the error on `startTime`
      ctx.addIssue({
        path: ["checkIn"],
        message: "checkIn time must be before checkOut time!",
        code: z.ZodIssueCode.custom,
      });
    }
  });
