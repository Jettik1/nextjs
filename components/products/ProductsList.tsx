import ProductItem from './ProductItem'
import { Product } from '@/lib/models/ProductModel'

const ProductsList = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
    {products.map((product) => (
      <ProductItem key={product.slug} product={product} />
    ))}
  </div>
)

export default ProductsList
