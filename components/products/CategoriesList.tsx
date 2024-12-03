'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

type Category = {
  _id: string
  name: string
}

interface CategoriesListProps {
  selectedCategoryId?: string
  onSelectCategory?: (id: string) => void
}

const CategoriesList = ({
  selectedCategoryId,
  onSelectCategory,
}: CategoriesListProps) => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    }

    fetchCategories()
  }, [])

  return (
    <aside className="categories-list">
      <h2 className="text-lg font-bold mb-2">Категории</h2>
      <ul>
        {categories.map((category) => {
          const isActive = category._id === selectedCategoryId
          return (
            <li
              key={category._id}
              className={`${
                isActive ? 'font-semibold text-blue-500' : 'text-gray-200'
              }`}
              onClick={() => onSelectCategory?.(category._id)}
            >
              <Link href={`/product/category/${category._id}`}>
                {category.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default CategoriesList
