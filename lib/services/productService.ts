import { cache } from 'react'
import dbConnect from '../dbConnect'
import ProductModel, { Product } from '../models/ProductModel'
import slugify from 'slugify'
import { convertDocToObj } from '../utils'
import path from 'path'
import { saveFiles } from '../fileUtils'

export const revalidate = 3600

function withConvertToObj<T extends Product | Product[] | null>(
  fn: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    const result = await fn(...args)
    if (Array.isArray(result)) {
      return result.map(convertDocToObj)
    }
    return convertDocToObj(result)
  }
}

const getLatestWithProps = cache(async (page: number, limit: number) => {
  await dbConnect()
  const skip = (page - 1) * limit

  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const convertedProducts = products.map(convertDocToObj)
  return { products: convertedProducts }
})

const searchProductsByName = async (
  query: string,
  page: number,
  limit: number
) => {
  try {
    const skip = (page - 1) * limit
    const products = await ProductModel.find({
      name: { $regex: query, $options: 'i' }, // поиск по названию, игнорируя регистр
    })
      .skip(skip) // пропускаем уже просмотренные товары
      .limit(limit) // ограничиваем количество возвращаемых товаров
      .lean()

    const total = await ProductModel.countDocuments({
      name: { $regex: query, $options: 'i' },
    })

    const convertedProducts = products.map(convertDocToObj)

    return { products: convertedProducts, total }
  } catch (error) {
    throw new Error('Ошибка поиска продуктов')
  }
}

const getLatest = cache(async (): Promise<Product[] | null> => {
  await dbConnect()
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(4)
    .lean<Product[]>()
  return products
})

const getBySlug = cache(async (slug: string): Promise<Product | null> => {
  await dbConnect()
  const product = await ProductModel.findOne({ slug }).lean<Product>()
  return product
})

const createProduct = async (productData: Product) => {
  await dbConnect()

  const existingProduct = await ProductModel.findOne({ slug: productData.slug })
  if (existingProduct) {
    return { error: 'Товар с таким названием уже существует' }
  }

  const newProduct = new ProductModel(productData)
  await newProduct.save()

  return newProduct
}

const deleteProductBySlug = async (slug: string) => {
  await dbConnect()
  const deletedProduct = await ProductModel.findOneAndDelete({ slug })
  if (!deletedProduct) {
    throw new Error(`Товар со слагом: "${slug}" не найден`)
  }
  return deletedProduct
}

const updateProductBySlug = async (
  slug: string,
  updateData: Partial<Product>,
  newImages?: File[]
): Promise<Product> => {
  await dbConnect()

  // Сохраняем новые изображения, если они переданы
  const savedImages = newImages ? await saveFiles(newImages) : []

  // Объединяем существующие изображения с новыми
  const combinedImages = [...(updateData.images || []), ...savedImages]

  // Обновляем данные в базе
  const updatedProduct = await ProductModel.findOneAndUpdate(
    { slug }, // slug мы не меняем при изменении имени продукта
    // См. реализацию в app\(front)\product\[slug]\edit\ProductEdit.tsx , строка 74
    // https://github.com/Jettik1/nextjs/blob/main/app/(front)/product/%5Bslug%5D/edit/ProductEdit.tsx#L74
    {
      ...updateData,
      images: combinedImages, // Указываем все изображения
      updatedAt: new Date(),
    },
    { new: true } // Возвращаем обновленный объект
  )

  if (!updatedProduct) {
    throw new Error(`Товар со слагом "${slug}" не найден`)
  }

  return updatedProduct
}

const productService = {
  getLatest: withConvertToObj(getLatest),
  getBySlug: withConvertToObj(getBySlug),
  createProduct: withConvertToObj(createProduct),
  deleteProductBySlug: withConvertToObj(deleteProductBySlug),
  updateProductBySlug: withConvertToObj(updateProductBySlug),
  getLatestWithProps,
  searchProductsByName,
}
export default productService
