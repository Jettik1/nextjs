import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  images: z.array(z.string()),
  price: z.number().positive(),
  description: z
    .string()
    .min(10, { message: 'Description should be at least 10 characters' }),
  category: z.string(),
  countInStock: z.number().int().nonnegative(),
})

export type ProductInput = z.infer<typeof productSchema>

export const validateProductData = (data: ProductInput) => {
  productSchema.parse(data)
}
