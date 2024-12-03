import data from '@/lib/data'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/Category'
import ProductModel from '@/lib/models/ProductModel'
import UserModel from '@/lib/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  if (process.env.NEXT_PUBLIC_DEV_MODE) {
    const { users, products, categories } = data
    await dbConnect()
    await UserModel.deleteMany()
    await UserModel.insertMany(users)

    await ProductModel.deleteMany()
    await ProductModel.insertMany(products)

    await CategoryModel.deleteMany()
    await CategoryModel.insertMany(categories)

    return NextResponse.json({
      message: 'успешно сгенерированы',
      users,
      products,
      categories,
    })
  } else {
    return NextResponse.json(
      { message: 'Developer mode is off' },
      { status: 403 }
    )
  }
}
