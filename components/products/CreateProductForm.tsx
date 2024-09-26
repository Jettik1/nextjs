'use client'
import { debounce } from '@/lib/utils'
import { useState } from 'react'
import { ProductInput, validateProductData } from '@/lib/validation'
import slugify from 'slugify'

export default function CreateProductForm({
  onSubmit,
}: {
  onSubmit: (formData: ProductInput) => void
}) {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    price: 0,
    images: [],
    countInStock: 0,
    description: '',
    category: '',
    slug: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    },
    1000
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setLoading(true)
      setError(null)

      // Автоматически создаём slug из названия
      const slug = slugify(formData.name, { lower: true })
      const productData = { ...formData, slug }

      // Валидация данных перед отправкой
      validateProductData(productData)

      onSubmit(formData)

      // Сбрасываем форму после успешного создания
      setFormData({
        name: '',
        slug: '',
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
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Product Name"
      />
      <input
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        type="number"
        placeholder="Price"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      {/* Другие поля формы */}
      <button type="submit">{loading ? 'Загрузка...' : 'Создать товар'}</button>
    </form>
  )
}
