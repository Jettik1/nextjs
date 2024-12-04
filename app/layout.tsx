import Header from '@/components/header/header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { getServerSession } from 'next-auth/next'
import { config } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Antiquatiate',
  description: 'Modern ECommerce Website',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = (await getServerSession(config)) || null

  return (
    <html lang="en">
      <body className={`${inter.className} px-0 mx-auto max-w-full`}>
        <Providers session={session}>
          <div className="min-h-screen flex flex-col">
            <Header />
            {children}
            <footer className="footer footer-center p-4 text-zinc-content bg-zinc-900/30">
              <p>Copyright © 2024 - All right reserved by Antiquariate</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
