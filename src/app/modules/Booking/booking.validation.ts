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


  const dateSchema = z
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
  )
  .refine(
    (date) => {
      const today = new Date();
      const inputDate = new Date(date);
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 9);

      // Strip time from both dates for accurate day-only comparison
      const input = inputDate.setHours(0, 0, 0, 0);
      const min = today.setHours(0, 0, 0, 0);
      const max = maxDate.setHours(23, 59, 59, 999);

      return input >= min && input <= max;
    },
    {
      message: "Date must be within 10 days including today",
    }
  );

export const createBookingWithoutPaymentSchema = z.object({
  restaurantId: z
    .string({
      required_error: "restaurantId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "restaurantId must be a valid ObjectId",
    }),
  scheduleId: z
    .string({
      required_error: "scheduleId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "scheduleId must be a valid ObjectId",
    }),
  diningId: z
    .string({
      required_error: "diningId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "diningId must be a valid ObjectId",
    }),
  guest: z
    .number()
    .positive("Guest must be a positive number")
    .min(1, "guest must be at least 1"),
});
  

export const createBookingWithPaymentSchema = z.object({
  reservationId: z
    .string({
      required_error: "reservationId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "reservationId must be a valid ObjectId",
    }),
  diningId: z
    .string({
      required_error: "diningId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "diningId must be a valid ObjectId",
    }),
  guest: z
    .number()
    .positive("Guest must be a positive number")
    .min(1, "guest must be at least 1"),
  amount: z.number().positive("amount must be positive number"),
});



  export const updateBookingStatusSchema = z.object({
    status: z.enum(["pending", "waitlist", "seating"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
  });