import { getServerSession } from 'next-auth/next'
import { Metadata } from 'next'
import ProductEdit from './ProductEdit'
import { redirect } from 'next/navigation'
import { config } from '@/lib/auth'
import productService from '@/lib/services/productService'

export const metadata: Metadata = {
  title: 'Редактировать товар',
  description: 'Страница для редактирования информации о товаре',
}

export default async function EditProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await getServerSession(config)

  // Проверяем, что сессия существует и что у пользователя правильная роль
  const isAuthorized =
    session?.user?.role === 'Admin' || session?.user?.role === 'Owner'

  if (!isAuthorized) {
    redirect('/')
  }

  const product = await productService.getBySlug(params.slug)

  if (!product) {
    return <div>Товар не найден</div>
  }

  return <ProductEdit product={product} />
}
