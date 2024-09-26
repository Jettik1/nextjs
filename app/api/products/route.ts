import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import productService from '@/lib/services/productService'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { name, description, price, category } = await req.json()

    const newProduct = new ProductModel({
      name,
      description,
      price,
      category,
    })

    await newProduct.save()

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URLSearchParams(req.nextUrl.searchParams)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '6')
    const products = await productService.getLatestWithProps(page, limit)

    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 }
    )
  }
}
