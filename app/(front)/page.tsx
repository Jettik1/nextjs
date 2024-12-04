import CategoriesList from '@/components/products/CategoriesList'
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
    <div className="flex h-full ">
      <div className="hidden lg:block text-lg w-64 menu bg-base-dark-300 p-4 rounded-box mr-8">
        <CategoriesList />
      </div>
      <div className="flex-grow">
        <ProductsGrid
          initialProducts={products as Product[]}
          fetchUrl="/api/products"
          title="Новейшие товары"
        />
      </div>
    </div>
  )
}
