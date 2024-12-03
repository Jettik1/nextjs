import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
})

const CategoryModel =
  mongoose.models.Category || mongoose.model('Category', CategorySchema)

export default CategoryModel
