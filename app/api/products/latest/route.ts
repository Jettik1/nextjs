import { NextRequest, NextResponse } from 'next/server'
import productService from '@/lib/services/productService'

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get('page')) || 1
  const limit = Number(req.nextUrl.searchParams.get('limit')) || 12

  const products = await productService.getLatestWithProps(page, limit)
  return NextResponse.json({ products, currentPage: page })
}
