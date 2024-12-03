// app/api/products/[slug]/route.ts
import dbConnect from '@/lib/dbConnect'
import { saveFiles } from '@/lib/fileUtils'
import CategoryModel from '@/lib/models/Category'
import ProductModel from '@/lib/models/ProductModel'
import { getOrCreateCategories } from '@/lib/services/categoriesService'
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
    const data = JSON.parse(formData.get('data') as string)

    const newImages = formData.getAll('newImages') as File[]
    const savedNewImages = await saveFiles(newImages)

    const updatedImages = [...data.images, ...savedNewImages]

    const categoryIds = await getOrCreateCategories(data.categories)

    const updatedProduct = await productService.updateProductBySlug(
      params.slug,
      {
        ...data,
        images: updatedImages,
        categories: categoryIds,
      }
    )

    return NextResponse.json({
      product: updatedProduct,
      message: 'Продукт успешно обновлен',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Ошибка при обновлении продукта' },
      { status: 500 }
    )
  }
}
