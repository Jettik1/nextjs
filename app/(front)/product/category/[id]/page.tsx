import CategoriesList from '@/components/products/CategoriesList'
import ProductsGrid from '@/components/products/ProductsGrid'
import { Product } from '@/lib/models/ProductModel'
import categoriesService from '@/lib/services/categoriesService'
import productService from '@/lib/services/productService'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Товары по категории',
  description: 'Товары, отсортированные по категории',
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { page?: number; limit?: number }
}) {
  const { id } = params
  const { page, limit } = searchParams

  // Загрузка текущей категории, всех категорий и продуктов
  const [categories, { products }] = await Promise.all([
    categoriesService.getAllCategories(),
    productService.getByCategoryId(id, page || 1, limit || 6),
  ])

  const currentCategory = categories.find(
    (category) => category._id === params.id
  )

  if (!currentCategory) {
    return <div>Категория не найдена</div>
  }

  return (
    <div className="flex">
      {/* Список категорий */}
      <div className="hidden lg:block text-lg w-64 menu bg-base-dark-300 p-4 rounded-box">
        <CategoriesList selectedCategoryId={params.id} />
      </div>

      {/* Основной контент */}
      <div className="flex-grow">
        <ProductsGrid
          initialProducts={products as Product[]}
          fetchUrl={`/api/categories/${id}`}
          title={`Товары категории: ${currentCategory.name}`}
        />
      </div>
    </div>
  )
}
