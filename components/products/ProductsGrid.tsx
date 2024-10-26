'use client'

import { useEffect } from 'react'
import { useProductsStore } from '@/lib/hooks/useProductsStore'
import ProductItem from './ProductItem'
import { Product } from '@/lib/models/ProductModel'

export default function ProductsGrid({
  initialProducts = [],
  fetchUrl,
  limit = 6,
  title,
}: {
  initialProducts?: Product[]
  limit?: number
  fetchUrl: string
  title: string
}) {
  const {
    products,
    page,
    hasNoMore,
    setProducts,
    setPage,
    setHasNoMore,
    cachedPages,
    cachePage,
    clearProducts,
    resetProducts,
  } = useProductsStore()

  const fetchProducts = async (page: number) => {
    try {
      const url = new URL(fetchUrl, window.location.origin)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', limit.toString())

      const res = await fetch(url.toString())

      if (!res.ok) {
        console.error('Ошибка при получении товаров:', res.statusText)
        return []
      }

      const data = await res.json()
      return data.products // Вернём массив товаров
    } catch (error) {
      console.error('Ошибка запроса:', error)
      return [] // Возвращаем пустой массив при ошибке
    }
  }

  // Загружаем продукты при первой загрузке или смене URL
  useEffect(() => {
    resetProducts() // Сброс товаров при переходе на новую страницу
    if (initialProducts.length > 0) {
      setProducts(initialProducts)
      setHasNoMore(initialProducts.length < limit) // Проверка на конец товаров
    } else {
      fetchProducts(1).then((data) => {
        setProducts(data)
        setHasNoMore(data.length < limit)
      })
    }
    return () => {
      clearProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUrl])

  const handleNextPage = async () => {
    const currentPage = page

    // Кэшируем данные текущей страницы
    cachePage(currentPage, products)

    const nextPage = currentPage + 1

    // Проверяем, есть ли данные уже закэшированные для следующей страницы
    if (cachedPages[nextPage]) {
      setProducts(cachedPages[nextPage])
    } else {
      const newProducts = await fetchProducts(nextPage)
      if (newProducts.length === 0) {
        setHasNoMore(true) // Если новых товаров нет
      } else {
        setProducts(newProducts) // Перезаписываем продукты новыми
      }
    }
    setPage(nextPage)
  }

  const handlePreviousPage = () => {
    const prevPage = page - 1
    if (prevPage > 0 && cachedPages[prevPage]) {
      setProducts(cachedPages[prevPage]) // Восстанавливаем товары из кэша предыдущей страницы
      setPage(prevPage)
      setHasNoMore(false) // Сбрасываем флаг "Все товары загружены"
    }
  }

  return (
    <>
      <h2 className="text-2xl py-2">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>

      <div className="flex justify-between space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Предыдущая страница
        </button>

        <button
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNextPage}
          disabled={hasNoMore}
        >
          {hasNoMore ? 'Все товары загружены' : 'Следующая страница'}
        </button>
      </div>
    </>
  )
}
