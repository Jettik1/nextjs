import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/Category'
import { getOrCreateCategories } from '@/lib/services/categoriesService'

export async function GET() {
  await dbConnect()
  const categories = await CategoryModel.find().lean()
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  await dbConnect()

  // Ожидаем массив названий категорий
  const { names } = await req.json()

  if (!names || !Array.isArray(names)) {
    return NextResponse.json(
      { error: 'Нужен массив названий категорий' },
      { status: 400 }
    )
  }

  try {
    // Используем сервис для обработки категорий
    const categoryIds = await getOrCreateCategories(names)

    return NextResponse.json(categoryIds, { status: 200 })
  } catch (error) {
    console.error('Ошибка обработки категорий:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при обработке категорий' },
      { status: 500 }
    )
  }
}
