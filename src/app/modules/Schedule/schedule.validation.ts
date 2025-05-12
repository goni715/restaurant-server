import { Types } from "mongoose";
import { z } from "zod";

const startTimeSchema = z
  .string({
    required_error: "Please select Start Time",
  })
  .min(1, { message: "Please select Start Time" })
  .refine(
    (value) => {
      const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
      return regex.test(value); //return true or false
    },
    {
      message: 'Invalid time format , expected "HH:MM" in 24 hours format',
    }
  );

const endTimeSchema = z
  .string({
    required_error: "Please select End Time",
  })
  .min(1, { message: "Please select End Time" })
  .refine(
    (value) => {
      const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
      return regex.test(value); //return true or false
    },
    {
      message: 'Invalid time format , expected "HH:MM" in 24 hours format',
    }
  );

const startDateSchema = z
  .string({
    required_error: "Please select Start Date",
  })
  .min(1, { message: "Please select Start Date" })
  .refine(
    (value) => {
      const dateRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; // "2024-11-25"
      return dateRegex.test(value); //return true or false
    },
    {
      message: `Invalid Date format , expected 'yyyy-MM-dd' format`,
    }
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

const endDateSchema = z
  .string({
    required_error: "Please select End Date",
  })
  .min(1, { message: "Please select End Date" })
  .refine(
    (value) => {
      const dateRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; // "2024-11-24"
      return dateRegex.test(value); //return true or false
    },
    {
      message: `Invalid Date format , expected 'yyyy-MM-dd' format`,
    }
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

export const createScheduleSchema = z
  .object({
    startDate: startDateSchema,
    endDate: endDateSchema,
    slot: z.array(
      z.object({
        startTime: startTimeSchema,
        endTime: endTimeSchema,
      })
    ),
  })
  .superRefine((values, ctx) => {
    const { startDate, endDate, slot } = values;

    // Create Date objects using the provided startDate and endDate
    const StartDate = new Date(startDate);
    const EndDate = new Date(endDate);

    if (StartDate > EndDate) {
      // Set the error on the `endTime` field
      ctx.addIssue({
        path: ["startDate"],
        message:
          "Start date & EndDate must be same or StartDate is less than End Date ",
        code: z.ZodIssueCode.custom,
      });

      // Alternatively, you could set the error on `startTime`
      ctx.addIssue({
        path: ["endDate"],
        message:
          "Start date & EndDate must be same or EndDate is greater than startDate ",
        code: z.ZodIssueCode.custom,
      });
    }

    for (let i = 0; i < slot.length; i++) {
      const { startTime, endTime } = slot[i];
      // Create Date objects using the provided startTime and endTime
      const start = new Date(`2024-01-01T${startTime}:00`);
      const end = new Date(`2024-01-01T${endTime}:00`);

      if (end <= start) {
        // Set the error on the `endTime` field
        ctx.addIssue({
          path: ["endTime"],
          message: "End time must be later than start time!",
          code: z.ZodIssueCode.custom,
        });

        // Alternatively, you could set the error on `startTime`
        ctx.addIssue({
          path: ["startTime"],
          message: "Start time must be before end time!",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });


