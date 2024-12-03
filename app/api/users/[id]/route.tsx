import { NextResponse } from 'next/server'
import UserModel, { UserRole } from '@/lib/models/UserModel'
import dbConnect from '@/lib/dbConnect'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { role } = await request.json()

  if (![UserRole.Admin, UserRole.Moderator, UserRole.User].includes(role)) {
    return NextResponse.json({ error: 'Недопустимая роль' }, { status: 400 })
  }

  await dbConnect()

  const user = await UserModel.findById(id)

  if (!user) {
    return NextResponse.json(
      { error: 'Пользователь не найден' },
      { status: 404 }
    )
  }
  // Запрещаем смену роли для Owner
  if (user.role === 'Owner') {
    return NextResponse.json(
      { error: 'Нельзя изменить роль владельца' },
      { status: 403 }
    )
  }

  user.role = role
  await user.save()

  return NextResponse.json(user)
}
