import productService from '@/lib/services/productService'
import ProductDeatails from './ProductDetails'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = await productService.getBySlug(params.slug)
  if (!product) {
    return { title: 'Товар не найден' }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await productService.getBySlug(params.slug)

  if (!product) {
    return <div>Товар не найден</div>
  }

  return (
    <>
      <div className="my-2">
        <ProductDeatails product={product} />
      </div>
    </>
  )
}

export const revalidate = 300
