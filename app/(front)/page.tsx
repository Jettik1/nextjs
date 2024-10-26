import ProductsGrid from '@/components/products/ProductsGrid'
import { Product } from '@/lib/models/ProductModel'
import productService from '@/lib/services/productService'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'E-commerce',
  description: process.env.NEXT_PUBLIC_APP_DESC || 'NextJS daisyui',
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: number; limit?: number }
}) {
  const { page, limit } = searchParams
  const { products } = await productService.getLatestWithProps(
    page || 1,
    limit || 6
  )

  return (
    <ProductsGrid
      initialProducts={products as Product[]}
      fetchUrl="/api/products"
      title="Новейшие товары"
    />
  )
}
