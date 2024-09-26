import CreateProductForm from '@/components/products/CreateProductForm'
import productService from '@/lib/services/productService'
import { ProductInput } from '@/lib/validation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Moderator Page',
  description: process.env.NEXT_PUBLIC_APP_DESC || 'adding a product',
}

export default async function DashboardPage() {
  const handleSubmit = async (formData: ProductInput) => {
    const response = await productService.createProduct(formData)
    return response
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Создание товара</h1>
      <CreateProductForm onSubmit={handleSubmit} />
    </div>
  )
}
