export type Product = {
  _id?: string
  name: string
  slug: string
  image: string
  banner?: string
  price: number
  description: string
  category: string
  countInStock: number
  colors?: []
  sizes?: []
}
