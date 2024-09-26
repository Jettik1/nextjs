import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PreferedRoles, UserRole } from '@/lib/models/UserModel'

const secret = process.env.NEXTAUTH_SECRET || 'default secret'

export async function middleware(req: NextRequest) {
  const { pathname }: { pathname: string } = req.nextUrl

  if (req.method === 'GET') {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret })
  if (!token || !PreferedRoles.includes(token.role as UserRole)) {
    return NextResponse.json({ message: 'Access denied' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/products/:path*', '/admin/:path*', '/dashboard/:path*'], // защищенные маршруты
}
