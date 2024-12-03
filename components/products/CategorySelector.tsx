import React, { useMemo, useState } from 'react'
import CreatableAsyncSelect from 'react-select/async-creatable'
import { ActionMeta, MultiValue } from 'react-select'
import { debounce } from '@/lib/utils'

type Option = { value: string; label: string }

type CategorySelectorProps = {
  defaultValue?: Option[] // Начальные значения
  value: Option[] // Выбранные категории
  onChange: (categories: Option[]) => void // Обработчик изменения
}

const customStyles = {
  multiValueRemove: (base: any, state: any) => ({
    ...base,
    color: 'red', // Постоянно видимый красный цвет
    ':hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.1)', // Светлый красный фон при наведении
      color: 'darkred', // Более тёмный красный при наведении
    },
  }),
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  defaultValue = [],
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('') // Для отслеживания пользовательского ввода
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    newValue: MultiValue<Option>,
    _actionMeta: ActionMeta<Option>
  ) => {
    onChange(newValue as Option[]) // Преобразуем MultiValue в обычный массив Option[]
  }

  const handleInputChange = (newInputValue: string) => {
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

  const loadOptions = useMemo(
    () =>
      debounce(async (inputValue: string): Promise<Option[]> => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/categories?search=${inputValue}`)
          const categories = await response.json()
          return categories.map((category: { _id: string; name: string }) => ({
            value: category._id,
            label: category.name,
          }))
        } catch (error) {
          console.error('Ошибка загрузки категорий:', error)
          return []
        } finally {
          setIsLoading(false)
        }
      }, 200), // 200ms задержка
    []
  )

  return (
    <CreatableAsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      defaultValue={defaultValue} // Устанавливаем начальные значения
      value={value}
      onChange={handleChange} // Используем адаптированный обработчик
      onInputChange={handleInputChange} // Обрабатываем пользовательский ввод
      onKeyDown={handleKeyDown} // Добавляем категории при нажатии Enter/запятой/пробела
      inputValue={inputValue} // Управляемое значение инпута
      placeholder={
        isLoading
          ? 'Загрузка категорий...'
          : 'Выберите категории или создайте новые...'
      }
      createOptionPosition="last" // Создание новых категорий всегда в конце списка
      styles={customStyles}
    />
  )
}

export default CategorySelector
