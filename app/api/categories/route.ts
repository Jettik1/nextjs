import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/Category'
import { getOrCreateCategories } from '@/lib/services/categoriesService'

export async function GET(req: Request) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams)
  const filter = search ? { name: { $regex: search, $options: 'i' } } : {} // Фильтр по тексту
  const categories = await CategoryModel.find(filter).limit(5) // Лимит 5 записей
  return NextResponse.json(categories) // ??? не мешает ли получать категории на главной странице
}

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { categories } = await req.json() // массив названий категорий
    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }

    const existingCategories = await CategoryModel.find({
      name: { $in: categories },
    })
    const existingCategoryNames = existingCategories.map((c) => c.name)

    const newCategoryNames = categories.filter(
      (c) => !existingCategoryNames.includes(c)
    )

    const newCategories = await CategoryModel.insertMany(
      newCategoryNames.map((name) => ({ name }))
    )

    const allCategories = [...existingCategories, ...newCategories]
    return NextResponse.json(allCategories)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create categories', error },
      { status: 500 }
    )
  }
}
