import { NextResponse } from 'next/server'
import UserModel from '@/lib/models/UserModel'
import dbConnect from '@/lib/dbConnect'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '50', 10)
  const search = searchParams.get('search') || ''

  await dbConnect()

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {}

  const users = await UserModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)

  const totalUsers = await UserModel.countDocuments(query)

  return NextResponse.json({
    users,
    total: totalUsers,
    hasMore: page * limit < totalUsers,
  })
}
