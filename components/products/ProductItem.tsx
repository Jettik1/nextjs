import { Product } from '@/lib/models/ProductModel'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="card bg-zinc-900/30 shadow-xl mb-4">
      <figure>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover h-64 w-full"
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link href={`product/${product.slug}`}>
          <h2 className="card-title font-normal">{product.name}</h2>
        </Link>
        <div className="card-actions flex items-center justify-between">
          <span className="text-2xl">₽{product.price}</span>
        </div>
      </div>
    </div>
  )
}
