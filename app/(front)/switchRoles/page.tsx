import { Metadata } from 'next'
import InfiniteUsersList from './SwitchUserRole'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Только для владельца',
  description:
    process.env.NEXT_PUBLIC_APP_DESC || 'Выбор роли для пользователей',
}

export default async function SwitchRoles() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Выбор роли для пользователей</h1>
      <InfiniteUsersList />
    </div>
  )
}
