import NextAuth from 'next-auth'
import { UserRole } from './lib/models/UserModel'

// Расширяем типизацию сессии
declare module 'next-auth' {
  interface Session {
    user: {
      _id: string
      name: string
      email: string
      role: UserRole // Добавляем роль
    }
  }
}
