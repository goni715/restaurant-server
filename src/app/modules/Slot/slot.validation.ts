import { z, ZodTypeAny } from 'zod';

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


export const createSlotSchema = z
  .object({
    startTime: startTimeSchema,
    endTime: endTimeSchema,
  })
  .superRefine((values, ctx) => {
    const { startTime, endTime } = values;
  
    // Create Date objects using the provided startTime and endTime
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    
    if (end <= start) {
      // Set the error on the `endTime` field
      ctx.addIssue({
          path: ["endTime"],
          message: "End time must be later than start time!",
          code:  z.ZodIssueCode.custom,
      });
      
      // Alternatively, you could set the error on `startTime`
      ctx.addIssue({
        path: ['startTime'],
        message: "Start time must be before end time!",
        code: z.ZodIssueCode.custom,
      });
    }
  });



