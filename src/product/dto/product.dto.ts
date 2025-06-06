import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
});

export type CreateProduct = z.infer<typeof createProductSchema>;