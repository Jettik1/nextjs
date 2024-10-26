import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  images: z
    .array(z.instanceof(File))
    .min(1, { message: 'At least one image is required' }),
  price: z.number().positive(),
  description: z
    .string()
    .min(4, { message: 'Description should be at least 10 characters' }),
  category: z.string(),
  countInStock: z.number().int().nonnegative(),
})

export type ProductInput = z.infer<typeof productSchema>

export const validateProductData = (data: ProductInput) => {
  try {
    productSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Если это ошибка Zod, выведем все сообщения об ошибках в понятном формате
      const errorMessages = error.errors.map((err) => err.message).join(', ')
      throw new Error(`Validation failed: ${errorMessages}`)
    } else {
      throw new Error('Unexpected error during validation')
    }
  }
}
