'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { Product } from '@/lib/models/ProductModel'
import ProductItem from './ProductItem'
import { convertDocToObj } from '@/lib/utils'

export default function ProductsGrid({
  initialProducts,
}: {
  initialProducts: Product[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [page, setPage] = useState(1)
  const [hasNoMore, setHasNoMore] = useState(false)
  const limit = 4 // заглушка

  const fetchProducts = async (newPage: number) => {
    const res = await fetch(`/api/products?page=${newPage}&limit=${limit}`)
    const newProducts = await res.json()
    setProducts(newProducts)
    setHasNoMore(newProducts.length < limit)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchProducts(newPage)
  }

  return (
    <>
      <h2 className="text-2xl py-2">Новейшие товары</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>

      <div className="flex justify-center space-x-4 bottom-14 w-full">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Предыдущая страница
        </button>
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(page + 1)}
          disabled={hasNoMore}
        >
          Следующая страница
        </button>
      </div>
    </>
  )
}
