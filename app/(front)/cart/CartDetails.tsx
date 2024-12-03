'use client'

import useCartService from '@/lib/hooks/useCartStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDetails() {
  const router = useRouter()
  const { items, totalPrice, decrease, increase } = useCartService()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <>
      <h1 className="py-4 text-2xl">Корзина покупок</h1>
      <p className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
        В настоящее время покупка онлайн недоступна, свяжитесь с нами по
        телефону{' '}
        <a
          href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
          className="btn btn-primary"
        >
          {process.env.NEXT_PUBLIC_PHONE_NUMBER}
        </a>
      </p>
      {items.length === 0 ? (
        <div>
          Корзина пуста{' '}
          <Link
            href="/"
            className="font-bold text-blue-400 hover:text-orange-400 bg-base-dark-300 hover:bg-base-dark-blue-200 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            В магазин
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-base-dark-800 text-left py-2 px-4">
                    Товар
                  </th>
                  <th className="text-base-dark-800 text-left py-2 px-4">
                    Количество
                  </th>
                  <th className="text-base-dark-800 text-left py-2 px-4">
                    Цена
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </td>
                    <td className="flex items-center gap-2">
                      <button
                        className="btn bg-base-200 hover:bg-base-300 text-base-content p-2 rounded"
                        type="button"
                        onClick={() => decrease(item)}
                      >
                        -
                      </button>
                      <span className="text-white">{item.qty}</span>
                      <button
                        className="btn bg-base-200 hover:bg-base-300 text-base-content p-2 rounded"
                        type="button"
                        onClick={() => increase(item)}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card bg-zinc-700">
            <div className="card-body">
              <ul>
                <li>
                  <div className="pb-3 text-xl">
                    В сумме ({items.reduce((a, c) => a + c.qty, 0)}) : ₽
                    {totalPrice}
                  </div>
                </li>
                <li>
                  <a
                    href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
                    className="btn btn-primary w-full"
                  >
                    Позвонить нам {process.env.NEXT_PUBLIC_PHONE_NUMBER}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
