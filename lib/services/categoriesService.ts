import CategoryModel from '@/lib/models/Category'
import { convertDocToObj } from '../utils'

type Category = {
  _id: string
  name: string
}

const categoriesService = {
  async getAllCategories() {
    const categories = await CategoryModel.find({}, 'name _id').lean()
    return categories.map(convertDocToObj)
  },

  async getCategoryById(id: string) {
    const category = await CategoryModel.findById(id, 'name _id').lean()
    return convertDocToObj(category)
  },
}

export async function getOrCreateCategories(names: string[]) {
  return await Promise.all(
    names.map(async (name) => {
      const normalized = name.trim().toLowerCase()
      let category = await CategoryModel.findOne({ name: normalized })

      if (!category) {
        category = await CategoryModel.create({ name: normalized })
      }

      return category._id
    })
  )
}

export default categoriesService
