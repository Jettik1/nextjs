'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState, useEffect } from 'react'

const SearchBar = ({ onClose }: { onClose?: () => void }) => {
  const [inputValue, setInputValue] = useState('') // Отдельное состояние для поля ввода
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim()) {
      router.push(`/product/search?query=${encodeURIComponent(inputValue)}`)
      if (onClose) onClose()
    }
  }

  useEffect(() => {
    // Синхронизируем только начальное значение из параметра строки поиска
    const currentQuery = searchParams.get('query') || ''
    setInputValue(currentQuery)
  }, [searchParams]) // Следим за изменениями параметров, но не за inputValue

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex items-center bg-gray-800 rounded-lg overflow-hidden"
    >
      <div className="relative flex-grow">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Обновляем значение при вводе
          placeholder="Искать товары"
          className="w-full py-2 pl-10 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19a9 9 0 100-18 9 9 0 000 18zm7-7h-.01"
            />
          </svg>
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-500 focus:outline-none"
      >
        Искать
      </button>
    </form>
  )
}

export default SearchBar
