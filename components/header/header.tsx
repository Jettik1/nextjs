import Link from 'next/link'
import React from 'react'
import Menu from './Menu'
import SearchBar from './SearchBar'

const Header = () => {
  return (
    <header>
      <nav>
        <div className="navbar justify-between bg-zinc-800">
          <Link href="/" className="btn btn-ghost text-lg">
            Antiquariate
          </Link>
          <div className="hidden lg:block">
            <SearchBar />
          </div>
          <Menu />
        </div>
      </nav>
    </header>
  )
}

export default Header
