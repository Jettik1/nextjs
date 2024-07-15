import { create } from 'zustand'
import { OrderItem } from '../models/OrderModel'
import { round2 } from '../utils'
import { persist } from 'zustand/middleware'

type Cart = {
  items: OrderItem[]
  totalPrice: number
}

const initialState: Cart = {
  items: [],
  totalPrice: 0,
}

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: 'cartStore',
  })
)

export default function useCartService() {
  const { items, totalPrice } = cartStore()
  return {
    items,
    totalPrice,
    decrease: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug)
      if (!exist) return
      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x: OrderItem) => x.slug !== item.slug)
          : items.map((x) => (item.slug ? { ...exist, qty: exist.qty - 1 } : x))
      const totalPrice = calcPrice(updatedCartItems)
      cartStore.setState({
        items: updatedCartItems,
        totalPrice,
      })
    },
    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug)
      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === item.slug
              ? {
                  ...exist,
                  qty: exist.qty + 1,
                }
              : x
          )
        : [...items, { ...item, qty: 1 }]
      const totalPrice = calcPrice(updatedCartItems)
      //** */
      cartStore.setState({
        items: updatedCartItems,
        totalPrice,
      })
    },
  }
}

const calcPrice = (items: OrderItem[]) => {
  return round2(items.reduce((acc, item) => acc + item.price * item.qty, 0))
}
