'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { validateProductData } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/models/ProductModel'
import Image from 'next/image'
import CategorySelector from '@/components/products/CategorySelector'

type ProductEditProps = {
  product: Product
}

type Option = { value: string; label: string }

const ProductEdit: React.FC<ProductEditProps> = ({ product }) => {
  const router = useRouter()

  const [formData, setFormData] = useState<Omit<Product, '_id' | 'slug'>>({
    name: product.name,
    images: product.images,
    price: product.price,
    description: product.description,
    categories: product.categories,
    countInStock: product.countInStock,
  })

  const [newImages, setNewImages] = useState<File[]>([])

  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([])

  // Объект с русскими названиями полей
  const fieldLabels: Record<string, string> = {
    name: 'Название',
    price: 'Цена',
    description: 'Описание',
    categories: 'Категории',
    countInStock: 'Количество на складе',
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'countInStock' || name === 'price' ? +value : value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setNewImages((prev) => [...prev, ...filesArray])
    }
  }

  const removeNewImage = (index: number) => {
    // Очистка временной ссылки перед удалением
    const url = URL.createObjectURL(newImages[index])
    URL.revokeObjectURL(url)

    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      // Создаем объект для валидации
      const validationData = {
        ...formData,
        images: newImages, // Используем только новые изображения для валидации
      }

      validateProductData(validationData) // Валидация данных

      // Формируем обновленные данные для отправки
      const updatedData: Product = {
        ...formData,
        slug: product.slug, // НЕ меняем SLUG
        images: [...formData.images, ...newImages.map((file) => file.name)], // Объединяем старые и новые изображения
      }

      const formPayload = new FormData()
      newImages.forEach((file) => formPayload.append('newImages', file))
      formPayload.append('data', JSON.stringify(updatedData))

      const res = await fetch(`/api/products/${product.slug}`, {
        method: 'PUT',
        body: formPayload,
      })

      if (!res.ok) {
        throw new Error('Не удалось обновить продукт')
      }

      router.push(`/products/${updatedData.slug}`)
    } catch (err) {
      console.error(err)
      alert('Ошибка: ' + (err as Error).message)
    }
  }

  useEffect(() => {
    // Для очистки ссылок при размонтировании компонента
    return () => {
      newImages.forEach((image) => {
        const url = URL.createObjectURL(image)
        URL.revokeObjectURL(url)
      })
    }
  }, [newImages])

  // ---

  const handleCategoryChange = (categories: Option[]) => {
    setSelectedCategories(categories) // Обновляем для UI
    setFormData((prev) => ({
      ...prev,
      categories: categories.map((c) => c.value), // Подготавливаем для отправки
    }))
  }

  // Загрузка категорий по ID продукта
  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const response = await fetch('/api/categories') // API для получения всех категорий
        const allCategories: { _id: string; name: string }[] =
          await response.json()

        // Преобразуем ID категорий из продукта в формат { value, label }
        const mappedCategories = product.categories
          .map((categoryId) =>
            allCategories.find((category) => category._id === categoryId)
          )
          .filter((category) => category) // Исключаем несопоставленные ID
          .map((category) => ({
            value: category!._id,
            label: category!.name,
          }))

        setSelectedCategories(mappedCategories)
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err)
      }
    }

    fetchCategoryNames()
  }, [product.categories])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {Object.entries(fieldLabels).map(([field, label]) => (
        <label key={field} className="flex flex-col">
          {label}:
          {field === 'categories' ? (
            <CategorySelector
              defaultValue={selectedCategories}
              value={selectedCategories}
              onChange={handleCategoryChange}
            />
          ) : (
            <input
              type={
                field === 'price' || field === 'countInStock'
                  ? 'number'
                  : 'text'
              }
              name={field}
              value={formData[field as keyof typeof formData] || ''}
              onChange={handleInputChange}
              className="bg-secondary p-2 rounded-md text-white"
            />
          )}
        </label>
      ))}

      <div className="flex flex-col gap-2">
        <span>Фотографии:</span>
        <div className="flex gap-2 flex-wrap">
          {formData.images.map((image, index) => (
            <div
              key={index}
              className="relative w-60 h-60 md:w-32 md:h-32 lg:w-40 lg:h-40"
            >
              <Image
                src={image}
                alt={`image-${index}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-sm rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <span>Добавить новые фото</span>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="bg-secondary p-2 rounded-md text-base-content"
        />
        {/* Отображение предварительного просмотра */}
        <div className="flex gap-2 flex-wrap mt-4">
          {newImages.map((image, index) => (
            <div
              key={index}
              className="relative w-60 h-60 md:w-32 md:h-32 lg:w-40 lg:h-40"
            >
              <Image
                src={URL.createObjectURL(image)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={`new-image-${index}`}
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-sm rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="bg-primary text-white p-2 rounded-md">
        Сохранить
      </button>
    </form>
  )
}

export default ProductEdit
