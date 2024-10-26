const LoadMoreButton = ({
  onLoadMore,
  disabled,
  hasNoMore,
}: {
  onLoadMore: () => void
  disabled: boolean
  hasNoMore: boolean
}) => (
  <div className="flex justify-center space-x-4 mt-4">
    <button
      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onLoadMore}
      disabled={disabled}
    >
      {hasNoMore ? 'Все товары загружены' : 'Загрузить ещё'}
    </button>
  </div>
)

export default LoadMoreButton
