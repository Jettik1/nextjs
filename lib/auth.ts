import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from './dbConnect'
import UserModel from './models/UserModel'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import { error } from 'console'

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()
        if (!credentials) return null

        const user = await UserModel.findOne({ email: credentials.email })

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (isMatch) return user
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/signin',
  },
  callbacks: {
    async jwt({ user, trigger, session, token }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && token.user) {
        session.user = token.user
      }
      return session
    },
  },
}

// Экспортируем NextAuth как обработчик API
const handler = NextAuth(config)

export { handler as GET, handler as POST }
