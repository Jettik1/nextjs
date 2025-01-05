import CategoriesList from '@/components/products/CategoriesList'

const CategoriesWrapper = () => {
  return (
    <div className="hidden lg:block text-lg w-64 menu bg-slate-950 p-4 rounded-box mr-8">
      <CategoriesList />
    </div>
  )
}

export default CategoriesWrapper
