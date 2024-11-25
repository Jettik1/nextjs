// app/api/products/[slug]/route.ts
import dbConnect from '@/lib/dbConnect'
import { saveFiles } from '@/lib/fileUtils'
import ProductModel from '@/lib/models/ProductModel'
import productService from '@/lib/services/productService'
import { NextRequest, NextResponse } from 'next/server'

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

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const deletedProduct = await productService.deleteProductBySlug(params.slug)

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Product successfully deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error deleting product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const formData = await req.formData()

    // Извлекаем JSON-данные
    const data = JSON.parse(formData.get('data') as string)

    // Извлекаем новые файлы
    const newImages = formData.getAll('newImages') as File[]

    // Обрабатываем новые изображения
    const savedNewImages = await saveFiles(newImages) //?

    // Объединяем старые и новые изображения
    const updatedImages = [...data.images, ...savedNewImages]

    // Обновляем данные в базе
    await productService.updateProductBySlug(params.slug, {
      ...data,
      updatedImages,
    })

    return NextResponse.json({ message: 'Продукт успешно обновлен' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Ошибка при обновлении продукта' },
      { status: 500 }
    )
  }
}
