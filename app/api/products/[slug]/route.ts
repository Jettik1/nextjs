// app/api/products/[slug]/route.ts
import productService from '@/lib/services/productService'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const product = await productService.getBySlug(params.slug)

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(product)
}
