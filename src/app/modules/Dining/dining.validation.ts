import { z } from "zod";



export const diningValidationSchema = z.object({
    name: z.string({
        required_error: "name is required"
    })
})