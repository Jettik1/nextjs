'use client'
import { useMemo, useState } from 'react'
import { ProductInput, validateProductData } from '@/lib/validation'
import slugify from 'slugify'
import styles from '@/components/styles.module.css'
import Image from 'next/image'
import CategorySelector from './CategorySelector'

type Option = {
  label: string
  value: string
}

export default function CreateProductForm() {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    images: [],
    price: 0,
    countInStock: 0,
    description: '',
    categories: [] as string[],
  })
  //const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!e.target) return
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      images: files,
    }))
  }

  const setMainImage = (index: number) => {
    setFormData((prev) => {
      const images = prev.images ?? []
      const updatedImages = [...images] as File[]
      const [mainImage] = updatedImages.splice(index, 1) // Убираем выбранное изображение
      updatedImages.unshift(mainImage) // Ставим его первым
      return { ...prev, images: updatedImages }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Автоматически создаём slug из названия
      const slug = slugify(formData.name, { lower: true })

      // Преобразуем данные для отправки
      const preparedData: ProductInput = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        categories: formData.categories.map((category) =>
          category.trim().toLowerCase()
        ),
      }

      // Валидация данных перед отправкой
      validateProductData(preparedData)

      const productDataToSend = new FormData()

      // Добавляем все поля, кроме images, в FormData
      Object.entries(preparedData).forEach(([key, value]) => {
        if (key === 'images') return

        if (Array.isArray(value)) {
          // Для массива (categories) добавляем каждое значение
          value.forEach((item) => productDataToSend.append(key, item))
        } else if (typeof value === 'number') {
          productDataToSend.append(key, value.toString())
        } else {
          productDataToSend.append(key, value as string)
        }
      })

      // Добавляем slug отдельно
      productDataToSend.append('slug', slug)

      // Добавляем изображения
      if (formData.images) {
        formData.images.forEach((image) => {
          productDataToSend.append('images', image) // Добавляем файлы
        })
      }

      // Отправляем запрос
      const response = await fetch('/api/products', {
        method: 'POST',
        body: productDataToSend,
      })

      if (!response.ok) {
        throw new Error('Ошибка при создании товара')
      }

      // Сбрасываем форму после успешного создания
      setFormData({
        name: '',
        images: [],
        price: 0,
        description: '',
        categories: [], // Сбрасываем массив категорий
        countInStock: 0,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ----

  /* const loadCategories = async (inputValue: string) => {
    const response = await fetch(`/api/categories?search=${inputValue}`)
    const categories = await response.json()
    return categories.map((category: { name: string }) => ({
      label: category.name,
      value: category.name,
    }))
  } */

  return (
    <div className="sm:w-full md:w-2/3 lg:w-1/2">
      <form /* className={styles.form} */ onSubmit={handleSubmit}>
        {error}
        <input
          className={styles.input}
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Название товара"
        />

        <span>Цена в рублях</span>
        <input
          className={styles.input}
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          placeholder="Цена"
        />

        <textarea
          className={styles.input}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Описание"
        />

        <span>Количество товара</span>
        <input
          className={styles.input}
          name="countInStock"
          type="number"
          value={formData.countInStock}
          onChange={handleChange}
          placeholder="Количество товара"
        />

        <CategorySelector
          value={formData.categories.map((category) => ({
            value: category,
            label: category,
          }))}
          onChange={(categories) =>
            setFormData((prev) => ({
              ...prev,
              categories: categories.map((c) => c.value),
            }))
          }
        />

        <input
          className={styles.input}
          type="file"
          name="images"
          multiple
          onChange={handleImageChange}
        />

        {formData.images ? (
          formData.images.map((file, index) => (
            <div key={index}>
              <Image
                src={URL.createObjectURL(file)}
                alt={`Image ${index}`}
                width={200}
                height={200}
                objectFit="cover" // Пропорционально вписываем изображение
              />
              <input
                type="radio"
                name="mainImage"
                checked={index === 0}
                onChange={() => setMainImage(index)}
              />
              <label>Выбрать как заглавную</label>
            </div>
          ))
        ) : (
          <></>
        )}

        <button className={styles.button} type="submit">
          {loading ? 'Загрузка...' : 'Создать товар'}
        </button>
      </form>
    </div>
  )
}
