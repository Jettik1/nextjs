import { NextRequest, NextResponse } from 'next/server'
import productService from '@/lib/services/productService'

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams)
  const query = searchParams.get('query') || ''
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '6')
  console.log('Api layer: ')
  console.log(`Query: ${query}, Page: ${page}, Limit: ${limit}`)

  try {
    const { products, total } = await productService.searchProductsByName(
      query,
      page,
      limit
    )

    return NextResponse.json({ products, total })
  } catch (error) {
    return NextResponse.json(
      { error: `Ошибка поиска товаров: ${error}` },
      { status: 500 }
    )
  }
}
