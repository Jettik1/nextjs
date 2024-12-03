import { create } from 'zustand'

interface User {
  _id: string
  name: string
  email: string
  role: string
}

interface UsersState {
  users: User[]
  page: number
  hasMore: boolean
  loading: boolean
  setUsers: (newUsers: User[], append: boolean) => void
  incrementPage: () => void
  setLoading: (isLoading: boolean) => void
  setHasMore: (hasMore: boolean) => void
  clearUsers: () => void
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  page: 1,
  hasMore: true,
  loading: false,
  setUsers: (newUsers, append = false) =>
    set((state) => ({
      users: append
        ? [...state.users, ...newUsers].filter(
            (user, index, array) =>
              array.findIndex((u) => u._id === user._id) === index
          )
        : newUsers,
    })),

  incrementPage: () =>
    set((state) => ({
      page: state.page + 1,
    })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setHasMore: (hasMore) => set(() => ({ hasMore })),
  clearUsers: () =>
    set(() => ({
      users: [],
      page: 1,
      hasMore: true,
      loading: false,
    })),
}))
