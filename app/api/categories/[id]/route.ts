import productService from '@/lib/services/productService'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string; page: number; limit: number } }
) {
  const { id, page, limit } = params
  const data = await productService.getByCategoryId(id, page, limit)
  return NextResponse.json({ data })
}
