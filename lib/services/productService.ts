import { cache } from 'react'
import dbConnect from '../dbConnect'
import ProductModel, { Product } from '../models/ProductModel'
import slugify from 'slugify'

export const revalidate = 3600

const getLatestWithProps = cache(async (page: number, limit: number) => {
  await dbConnect()
  const skip = (page - 1) * limit

  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return products as Product[]
})

const getLatest = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({}).sort({ _id: -1 }).limit(4).lean()
  return products as Product[]
})

const getBySlug = cache(async (slug: string) => {
  await dbConnect()
  const product = await ProductModel.findOne({ slug }).lean()
  return product as Product
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
    throw new Error(`Product with slug ${slug} not found`)
  }
  return deletedProduct
}

const updateProductBySlug = async (
  slug: string,
  updateData: Partial<Product>
) => {
  await dbConnect()

  const updatedProduct = await ProductModel.findOneAndUpdate(
    { slug },
    updateData,
    { new: true }
  )

  if (!updatedProduct) {
    throw new Error(`Product with slug ${slug} not found`)
  }

  return updatedProduct
}

const productService = {
  getLatest,
  getBySlug,
  getLatestWithProps,
  createProduct,
  deleteProductBySlug,
  updateProductBySlug,
}
export default productService
