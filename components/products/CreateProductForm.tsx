'use client'
import { debounce } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { ProductInput, validateProductData } from '@/lib/validation'
import slugify from 'slugify'
import styles from '@/components/styles.module.css'
import { number } from 'zod'
import Image from 'next/image'

export default function CreateProductForm() {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    images: [],
    price: 0,
    countInStock: 0,
    description: '',
    category: '',
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
      const updatedImages = [...prev.images] as File[]
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

      const preparedData: ProductInput = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      }

      // Валидация данных перед отправкой
      validateProductData(preparedData)

      const productDataToSend = new FormData()

      Object.entries(preparedData).forEach(([key, value]) => {
        // Пропускаем поле images, так как для него отдельная логика
        if (key === 'images') return

        // Преобразуем числа в строки для FormData
        if (typeof value === 'number') {
          productDataToSend.append(key, value.toString())
        } else {
          productDataToSend.append(key, value as string)
        }
      })

      productDataToSend.append('slug', slug)

      formData.images.forEach((image) => {
        productDataToSend.append('images', image) // Добавляем файлы как объекты
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        body: productDataToSend, // Передаём FormData без сериализации
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
        category: '',
        countInStock: 0,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

        <input
          className={styles.input}
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Категория"
        />

        <input
          className={styles.input}
          type="file"
          name="images"
          multiple
          onChange={handleImageChange}
        />

        {formData.images.map((file, index) => (
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
        ))}

        <button className={styles.button} type="submit">
          {loading ? 'Загрузка...' : 'Создать товар'}
        </button>
      </form>
    </div>
  )
}
