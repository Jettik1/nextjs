'use client'
import { useEffect, useRef, useState } from 'react'
import { useUsersStore } from '@/lib/hooks/useUsersStore'
import { UserRole } from '@/lib/utils'

const InfiniteUsersList = () => {
  const {
    users,
    page,
    hasMore,
    loading,
    setUsers,
    incrementPage,
    setLoading,
    setHasMore,
    clearUsers,
  } = useUsersStore()

  const [searchTerm, setSearchTerm] = useState('')
  const observerRef = useRef<HTMLDivElement | null>(null)
  const [selectedUser, setSelectedUser] = useState<null | {
    id: string
    role: string
  }>(null)
  const [newRole, setNewRole] = useState<string>('')

  // Функция для загрузки пользователей
  const fetchUsers = async () => {
    if (!hasMore || loading) return
    setLoading(true)

    try {
      const query = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : ''
      const res = await fetch(`/api/users?page=${page}&limit=50${query}`)
      const data = await res.json()

      if (data.users.length > 0) {
        setUsers(data.users, page > 1) // Объединяем только если это не первая страница
      }
      if (data.users.length < 50) {
        setHasMore(false) // Последняя страница
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка данных при изменении страницы

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Наблюдатель для бесконечного скролла
  useEffect(() => {
    const currentRef = observerRef.current // Копируем значение ref

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          incrementPage()
        }
      },
      { threshold: 1.0 }
    )

    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef) // Используем зафиксированное значение
    }
  }, [hasMore, loading, incrementPage])

  // Обработка изменений строки поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    clearUsers() // Сбрасываем данные при изменении поискового запроса
  }

  // Загрузка данных при изменении строки поиска
  useEffect(() => {
    if (searchTerm.length === 0 || searchTerm.length >= 3) {
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const openModal = (userId: string, role: string) => {
    setSelectedUser({ id: userId, role })
    setNewRole(role) // Устанавливаем текущую роль
  }

  const closeModal = () => setSelectedUser(null)

  const saveRoleChange = async () => {
    if (!selectedUser) return

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        const updatedUser = await res.json()
        setUsers([updatedUser], true) // Обновляем список
        closeModal()

        setUsers(
          users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          ),
          false
        )
        return { success: true }
      } else {
        console.error('Ошибка обновления роли')
      }
    } catch (error) {
      console.error('Ошибка при сохранении роли:', error)
    }
  }

  return (
    <div>
      <h1>Список пользователей</h1>
      <input
        type="text"
        placeholder="Поиск по имени или email"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 mb-4 w-full"
      />
      <ul>
        {users.map((user) => (
          <li key={user._id} className="flex justify-between items-center py-2">
            <span>
              {user.name} - {user.email}
            </span>
            <button
              onClick={() => openModal(user._id, user.role)}
              className="text-blue-500 underline"
            >
              {user.role}
            </button>
          </li>
        ))}
      </ul>
      {loading && <p>Загрузка...</p>}
      {hasMore && <div ref={observerRef} style={{ height: '1px' }} />}

      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-base-dark-400 text-white rounded-lg p-6 shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри
          >
            <button
              onClick={closeModal}
              className="absolute top-2 font-extrabold right-2 text-red-500 hover:text-blue-500"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Смена роли</h2>
            <p className="mb-4">Выберите новую роль для пользователя</p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border p-2 mb-4 bg-base-dark-400"
            >
              <option value={UserRole.User}>User</option>
              <option value={UserRole.Moderator}>Moderator</option>
              <option value={UserRole.Admin}>Admin</option>
            </select>
            <button
              onClick={saveRoleChange}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InfiniteUsersList
