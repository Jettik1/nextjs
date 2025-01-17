const reactSelectStyles = {
  // Стили для контейнера списка опций
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#1a1a1a', // Тёмный фон
    zIndex: 9999, // Убедитесь, что меню поверх других элементов
  }),
  // Стили для опций в списке
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? '#333' : '#1a1a1a', // Цвет фона для активной и неактивной опций
    color: state.isFocused ? '#fff' : '#ccc', // Цвет текста
    cursor: 'pointer',
  }),
  // Стили для текста в поле выбора
  multiValueLabel: (base: any) => ({
    ...base,
    color: 'black', // Цвет текста метки выбранной опции
  }),
  // Стили для кнопки удаления выбранной опции
  multiValueRemove: (base: any) => ({
    ...base,
    color: '#fff', // Цвет кнопки удаления
    ':hover': {
      backgroundColor: '#f00', // Красный фон при наведении
      color: '#fff',
    },
  }),
}

export default reactSelectStyles
