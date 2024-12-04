'use client'

import AddToCart from '@/components/products/AddToCart'
import { Product } from '@/lib/models/ProductModel'
import { UserRole } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type ProductDetailsProps = {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { data: session } = useSession()
  const isAdminOrOwner =
    session?.user?.role === UserRole.Admin ||
    session?.user?.role === UserRole.Owner
  const router = useRouter()
  const images = product.images
  const [selectedImage, setSelectedImage] = useState(images[0])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const confirmDeleteProduct = async () => {
    try {
      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Ошибка при удалении товара')
      }

      setIsDeleteModalOpen(false)
      // Добавить редирект
    } catch (error) {
      console.error(error)
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.id === 'modalOverlay') {
      closeModal()
    }
  }

  return (
    <>
      {/* Контейнер страницы */}
      <div className="my-2">
        {/* Кнопка "назад к товарам" и информация о товаре */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-4">
          <Link href="/" className="mb-4 md:mb-0">
            <button
              className="bg-base-dark-blue-600 text-white p-2 rounded flex items-center mt-4"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              ← Назад к товарам
            </button>
          </Link>
          <div className="md:hidden text-center">
            <h1 className="text-xl">{product.name}</h1>
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid md:grid-cols-4 md:gap-6">
          {/* Левая колонка: основное изображение и галерея */}
          <div className="md:col-span-2">
            {/* Основное изображение */}
            <Image
              src={selectedImage}
              alt={product.name}
              width={640}
              height={640}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
              className="object-cover cursor-pointer mb-4"
              onClick={openModal}
            />

            {/* Галерея изображений */}
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 ${
                    selectedImage === image
                      ? 'border-blue-500'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`${index + 1}`}
                    width={100}
                    height={100}
                    sizes="100vw"
                    style={{ width: '100px', height: 'auto' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка (на компьютере) */}
          <div className="md:col-span-2 md:flex md:flex-col">
            {/* На телефоне: Название и цена под кнопкой */}
            <div className="hidden md:block">
              <h1 className="text-2xl mb-2">{product.name}</h1>
            </div>

            {/* Карточка с деталями */}
            <div className="card bg-zinc-800 shadow-xl mb-4">
              <div className="card-body">
                <div className="mb-2 flex justify-between">
                  <div>Цена</div>
                  <div>{product.price} ₽</div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>{product.countInStock} в наличии</div>
                </div>
                {product.countInStock !== 0 && (
                  <div className="card-actions justify-center">
                    <AddToCart
                      item={{
                        ...product,
                        qty: 0,
                      }}
                      countInStock={Number(product.countInStock)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Описание (на телефоне внизу страницы) */}
            <div className="hidden md:block">
              <h3 className="text-lg">Описание:</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Описание товара на мобильных устройствах */}
        <div className="md:hidden mt-4">
          <h3 className="text-lg">Описание:</h3>
          <p>{product.description}</p>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div
          id="modalOverlay"
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleOutsideClick} // Обработка клика вне окна
        >
          <div className="relative">
            {/* Увеличенное изображение */}
            <Image
              src={selectedImage}
              alt="Увеличенное изображение"
              width={800}
              height={800}
              className="object-contain"
            />
            {/* Кнопка закрытия */}
            <button
              className="absolute top-2 right-2 rounded-full p-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Кнопки для админа/владельца */}
      {isAdminOrOwner && (
        <div className="flex space-x-2">
          {/* Кнопка удаления */}
          <button
            className="bg-red-500 text-white p-2 rounded flex items-center mt-4"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            🗑️ Удалить
          </button>

          {/* Кнопка редактирования */}
          <button
            className="bg-zinc-800 text-white p-2 rounded flex items-center mt-4"
            onClick={() => router.push(`/product/${product.slug}/edit`)}
          >
            ✏️ Редактировать
          </button>
        </div>
      )}

      {/* Модальное окно для подтверждения удаления */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Вы уверены, что хотите удалить товар?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={confirmDeleteProduct}
              >
                Удалить
              </button>
              <button
                className="p-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
