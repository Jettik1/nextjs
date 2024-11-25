import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import productService from '@/lib/services/productService'
import path from 'path'
import fs from 'fs/promises'
import { saveFiles } from '@/lib/fileUtils'

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсер
  },
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Получаем данные продукта
    const name = formData.get('name')
    const slug = formData.get('slug')
    const price = Number(formData.get('price'))
    const countInStock = Number(formData.get('countInStock'))
    const description = formData.get('description')
    const category = formData.get('category')

    const images = formData.getAll('images') as File[]

    const savedImages = await saveFiles(images)

    await dbConnect()

    const newProduct = new ProductModel({
      name,
      slug,
      price,
      images: savedImages,
      countInStock,
      description,
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
      { message: 'Ошибка создания товара' },
      { status: 500 }
    )
  }
}
