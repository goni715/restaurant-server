import { z } from "zod";



export const cuisineValidationSchema = z.object({
    name: z.string({
        required_error: "name is required"
    }).trim()
})

