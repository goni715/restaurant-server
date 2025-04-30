import { z } from 'zod';

export const createFaqValidationSchema = z.object({
  question: z.string({
    required_error: "question is required!"
  }),
  answer: z.string({
    required_error: "answer is required !"
  }),
  category: z.string().optional(),
});

export const updateFaqValidationSchema = z.object({
  question: z.string({
    required_error: "question is required!"
  }).optional(),
  answer: z.string({
    required_error: "answer is required !"
  }).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional()
});
