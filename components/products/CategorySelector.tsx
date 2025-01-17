import React, { useCallback, useMemo, useState } from 'react'
import CreatableAsyncSelect from 'react-select/async-creatable'
import { ActionMeta, MultiValue } from 'react-select'
import { debounce } from '@/lib/utils'
import reactSelectStyles from './reactSelectStyles'

type Option = { value: string; label: string }

type CategorySelectorProps = {
  defaultValue?: Option[] // Начальные значения
  className?: string
  value: Option[] // Выбранные категории
  onChange: (categories: Option[]) => void // Обработчик изменения
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  defaultValue = [],
  value,
  onChange,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('') // Для отслеживания пользовательского ввода
  const [isLoading, setIsLoading] = useState(false)
  /// value.map((value) => console.log(value))

  const handleChange = (
    newValue: MultiValue<Option>,
    _actionMeta: ActionMeta<Option>
  ) => {
    onChange(newValue as Option[]) // Преобразуем MultiValue в обычный массив Option[]
  }

  const handleInputChange = (newInputValue: string) => {
    ///console.log('Текущее значение inputValue:', newInputValue)
    setInputValue(newInputValue) // Обновляем значение инпута
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',') {
      const trimmedInput = inputValue.trim()

      if (trimmedInput !== '') {
        // Проверяем дубликаты без учета регистра
        const isDuplicate = value.some(
          (option) => option.value.toLowerCase() === trimmedInput.toLowerCase()
        )

        if (!isDuplicate) {
          // Сохраняем категорию в исходном регистре
          onChange([...value, { label: trimmedInput, value: trimmedInput }])
        }
      }

      setInputValue('') // Очищаем поле после добавления
      event.preventDefault() // Предотвращаем стандартное поведение Enter
    }
  }

  const loadOptions = useCallback((inputValue: string): Promise<Option[]> => {
    // Возвращаем Promise для react-select
    return new Promise((resolve) => {
      // Дебаунс-функция вызывает API и передаёт результат через resolve
      debounce(async () => {
        ///console.log('Загрузка категорий для ввода:', inputValue) // Отладочный лог
        try {
          setIsLoading(true)
          const response = await fetch(`/api/categories?search=${inputValue}`)
          if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`)
          }
          const categories = await response.json()
          ///console.log('Полученные категории:', categories) // Лог результата
          const refreshCategories = categories.map(
            (category: { _id: string; name: string }) => ({
              value: category._id,
              label: category.name,
            })
          )
          ///console.log(refreshCategories)
          resolve(refreshCategories)
        } catch (error) {
          console.error('Ошибка загрузки категорий:', error)
          resolve([]) // Возвращаем пустой массив при ошибке
        } finally {
          setIsLoading(false)
        }
      }, 500)() // Вызов debounce
    })
  }, [])

  return (
    <div className={`${className}`}>
      <CreatableAsyncSelect
        isMulti
        cacheOptions={false}
        defaultOptions={false}
        loadOptions={loadOptions}
        defaultValue={defaultValue} // Устанавливаем начальные значения
        value={value}
        onChange={handleChange} // Используем адаптированный обработчик
        onInputChange={handleInputChange} // Обрабатываем пользовательский ввод
        onKeyDown={handleKeyDown} // Добавляем категории при нажатии Enter/запятой/пробела
        inputValue={inputValue} // Управляемое значение инпута
        isLoading={isLoading}
        placeholder={
          isLoading
            ? 'Загрузка категорий...'
            : 'Выберите категории или создайте новые...'
        }
        loadingMessage={() =>
          inputValue.trim()
            ? `Ищем категории, соответствующие "${inputValue}"...`
            : 'Загрузка категорий...'
        }
        createOptionPosition="last" // Создание новых категорий всегда в конце списка
        styles={reactSelectStyles}
      />
    </div>
  )
}

export default CategorySelector
