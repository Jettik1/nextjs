import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import productService from '@/lib/services/productService'
import { saveFiles } from '@/lib/fileUtils'
import CategoryModel from '@/lib/models/Category'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Получаем данные продукта
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const price = Number(formData.get('price'))
    const countInStock = Number(formData.get('countInStock'))
    const description = formData.get('description') as string
    const categories = formData.getAll('categories') as string[] // Ожидаем массив категорий
    const images = formData.getAll('images') as File[]

    // Сохраняем изображения
    const savedImages = await saveFiles(images)

    await dbConnect()

    // Обработка категорий
    const categoryPromises = categories.map(async (category) => {
      const normalizedCategory = category.trim().toLowerCase()

      // Проверяем существование категории
      let existingCategory = await CategoryModel.findOne({
        name: normalizedCategory,
      })

      // Если категории нет, создаём новую
      if (!existingCategory) {
        existingCategory = await CategoryModel.create({
          name: normalizedCategory,
        })
      }

      return existingCategory._id // Возвращаем ObjectId категории
    })

    const categoryIds = await Promise.all(categoryPromises)

    // Создаём продукт
    const newProduct = new ProductModel({
      name,
      slug,
      price,
      images: savedImages,
      countInStock,
      description,
      categories: categoryIds, // Сохраняем ID категорий
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
