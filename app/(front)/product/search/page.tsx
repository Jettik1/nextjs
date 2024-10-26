import ProductsGrid from '@/components/products/ProductsGrid'
import Spinner from '@/components/products/Spinner'
import { Product } from '@/lib/models/ProductModel'
import productService from '@/lib/services/productService'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'E-commerce',
  description: process.env.NEXT_PUBLIC_APP_DESC || 'NextJS daisyui',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string }
}) {
  const searchQuery = searchParams.query || ''
  const { products, total } = await productService.searchProductsByName(
    searchQuery,
    1,
    6
  )

  return (
    <Suspense fallback={<Spinner />}>
      <ProductsGrid
        fetchUrl={`/api/products/search?query=${searchQuery}`} // URL для поиска с параметрами
        title={`Результаты поиска для "${searchQuery}"`}
      />
    </Suspense>
  )
}
