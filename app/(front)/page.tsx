import ProductItem from '@/components/products/ProductItem'
import ProductsGrid from '@/components/products/ProductsGrid'
import data from '@/lib/data'
import { Product } from '@/lib/models/ProductModel'
import productService from '@/lib/services/productService'
import { Metadata } from 'next'
import { useEffect, useState } from 'react'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'E-commerce',
  description: process.env.NEXT_PUBLIC_APP_DESC || 'NextJS daisyui zustand',
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: number; limit?: number }
}) {
  const { page, limit } = searchParams
  const products = await productService.getLatestWithProps(
    page || 1,
    limit || 4
  )

  // const [products, setProducts] = useState<Product[]>([])
  // const [page, setPage] = useState(1)
  // const [limit, setLimit] = useState(10)

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const data = await productService.getLatestWithProps(page, limit)
  //     setProducts(data)
  //   }

  //   fetchProducts()
  // }, [page, limit])

  // const handlePageChange = (newPage: number) => {
  //   setPage(newPage)
  // }

  // // const latestProducts = await productService.getLatestWithProps(page, limit)

  return <ProductsGrid initialProducts={products} />
  // (
  //   <>
  //     <h2 className="text-2xl py-2">Latest Products</h2>
  //     <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
  //       {products.map((product) => (
  //         <ProductItem key={product.slug} product={convertDocToObj(product)} />
  //       ))}
  //     </div>

  //     <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
  //       Предыдущая страница
  //     </button>
  //     <button onClick={() => handlePageChange(page + 1)}>
  //       Следующая страница
  //     </button>
  //   </>
  // )
}
