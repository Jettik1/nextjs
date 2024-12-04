'use client'

import useCartService from '@/lib/hooks/useCartStore'
import { PreferedRoles, UserRole } from '@/lib/utils'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import CategoriesList from '../products/CategoriesList'

const Menu = () => {
  const { items } = useCartService()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' })
  }

  const { data: session } = useSession()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div>
      <ul className="flex items-stretch lg:flex">
        <button
          className="lg:hidden btn btn-ghost rounded-btn"
          type="button"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>

        {session?.user.role === UserRole.Owner ? (
          <li>
            <Link
              className="hidden lg:flex btn btn-ghost rounded-btn"
              href="/switchRoles"
            >
              <>Выбрать роли</>
            </Link>
          </li>
        ) : null}

        <li>
          <Link
            className="hidden lg:flex btn btn-ghost rounded-btn"
            href="/dashboard"
          >
            {session?.user?.role &&
            PreferedRoles.includes(session.user.role) ? (
              <>Создание товара</>
            ) : (
              <></>
            )}
          </Link>
        </li>

        <li className="hidden lg:flex">
          <Link className="btn btn-ghost rounded-btn" href="/cart">
            Корзина
            {mounted && items.length != 0 && (
              <div className="badge badge-secondary">
                {items.reduce((a, c) => a + c.qty, 0)}{' '}
              </div>
            )}
          </Link>
        </li>

        {session && session.user ? (
          <li className="hidden lg:flex">
            <div className="dropdown dropdown-bottom drpodown-end">
              <label tabIndex={0} className="btn btn-ghost rounded-btn">
                {session.user.name}
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] p-2 shadow bg-base-dark-300 rounded-box w-25 max-w-full"
              >
                <li onClick={signoutHandler}>
                  <button type="button" onClick={signoutHandler}>
                    Выйти
                  </button>
                </li>
              </ul>
            </div>
          </li>
        ) : (
          <li className="hidden lg:flex">
            <button
              className="btn btn-ghost rounded-btn"
              type="button"
              onClick={() => signIn()}
            >
              Войти
            </button>
          </li>
        )}
      </ul>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-base-dark-300 rounded-lg w-11/12 max-w-md p-5">
            <button
              className="btn btn-sm btn-ghost rounded-btn mb-5"
              onClick={toggleMobileMenu}
            >
              ✕
            </button>
            <div>{session?.user.name}</div>
            <ul className="menu text-lg">
              <li>
                <SearchBar onClose={() => setIsMobileMenuOpen(false)} />
              </li>
              <li>
                <div className="h-64 overflow-y-auto block lg:hidden">
                  <CategoriesList />
                </div>
              </li>
              {session?.user.role === UserRole.Owner ? (
                <li>
                  <Link href="/switchRoles" onClick={toggleMobileMenu}>
                    <>Выбрать роли</>
                  </Link>
                </li>
              ) : null}
              {session?.user?.role &&
              PreferedRoles.includes(session.user.role) ? (
                <li>
                  <Link href="/dashboard" onClick={toggleMobileMenu}>
                    <>Создание товара</>
                  </Link>
                </li>
              ) : null}
              <li>
                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  Корзина
                  {mounted && items.length != 0 && (
                    <div className="badge badge-secondary">
                      {items.reduce((a, c) => a + c.qty, 0)}{' '}
                    </div>
                  )}
                </Link>
              </li>
              {session && session.user ? (
                <li onClick={signoutHandler}>
                  <button
                    type="button"
                    onClick={() => {
                      signoutHandler()
                      toggleMobileMenu()
                    }}
                  >
                    Выйти
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    className="btn btn-ghost rounded-btn"
                    type="button"
                    onClick={() => signIn()}
                  >
                    Войти
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu
