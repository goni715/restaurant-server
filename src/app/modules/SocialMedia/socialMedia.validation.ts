import { z } from "zod";


export const socialMediaSchema = z.object({
  website: z.string().url().optional(),
  facebook: z.string().url().optional(),
  youtube: z.string().url().optional(),
  instagram: z.string().url().optional(),
  other: z.string().optional(),
});


