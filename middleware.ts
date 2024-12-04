import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken, JWT } from 'next-auth/jwt'
import { PreferedRoles, UserRole } from '@/lib/utils'

const secret = process.env.NEXTAUTH_SECRET || 'default secret'

interface myJWT extends JWT {
  user: {
    _id: string
    email: string
    name: string
    role: string
  }
}

export async function middleware(req: NextRequest) {
  const { pathname }: { pathname: string } = req.nextUrl

  if (req.method === 'GET') {
    return NextResponse.next()
  }

  const token = (await getToken({ req, secret })) as myJWT
  if (!token) {
    console.log('Token is missing')
    return NextResponse.redirect('/login')
  }

  try {
    if (!token || !PreferedRoles.includes(token.user.role as UserRole)) {
      console.log('Token is not access: ', token)

      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }
  } catch (error) {
    console.log('Authorization error:', error)
    return NextResponse.error()
  }
}

export const config = {
  matcher: ['/api/products/:path*', '/admin/:path*', '/dashboard/:path*'], // защищенные маршруты
}
