import data from '@/app/lib/data'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductDeatails({
  params,
}: {
  params: { slug: string }
}) {
  const product = data.products.find((x) => x.slug === params.slug)
  if (!product) {
    return <div>Товар не найден</div>
  }
  return (
    <>
      <div className="my-2">
        <Link href="/">назад к товарам</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.name}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          ></Image>
        </div>
        <div>
          <ul className="space-y-4">
            <li>
              <h1 className="text-xl">{product.name}</h1>
            </li>
            <li>{product.brand}</li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              Описание: <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div className="card bg-zinc-800 shadow-xl mt-3 md:mt-0">
          <div className="card-body">
            <div className="mb-2 flex justify-between">
              <div>Цена</div>
              <div>{product.price} ₽</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>{product.countInStock} в наличии</div>
            </div>
            <div className="card-actions justify-center">
              <button className="btn btn-primary w-full" type="button">
                Добавить в Корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
