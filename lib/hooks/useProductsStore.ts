import { create } from 'zustand'
import { Product } from '@/lib/models/ProductModel'

interface ProductsStore {
  products: Product[]
  page: number
  hasNoMore: boolean
  cachedPages: { [key: number]: Product[] } // Кэш страниц
  setProducts: (products: Product[]) => void
  setPage: (page: number) => void
  setHasNoMore: (hasNoMore: boolean) => void
  cachePage: (page: number, products: Product[]) => void
  clearProducts: () => void
  resetProducts: () => void
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  page: 1,
  hasNoMore: false,
  cachedPages: {},

  setProducts: (products) => set({ products }),
  setPage: (page) => set({ page }),
  setHasNoMore: (hasNoMore) => set({ hasNoMore }),

  cachePage: (page, products) =>
    set((state) => ({
      cachedPages: { ...state.cachedPages, [page]: products },
    })),

  clearProducts: () =>
    set({
      products: [],
      page: 1,
      hasNoMore: false,
      cachedPages: {},
    }),

  resetProducts: () =>
    set({
      products: [],
      page: 1,
      hasNoMore: false,
    }),
}))
