'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'

const navigation = [
  { href: '/market', label: 'Market Plan' },
  { href: '/#phuong-phap', label: 'Phương pháp' },
  { href: '/#tao-ke-hoach', label: 'Tạo kế hoạch' },
  { href: '/#nguyen-tac', label: 'Nguyên tắc' },
]

export function SiteHeader() {
  const { user, status, signIn, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const authAction =
    status === 'loading' ? (
      <span className="text-muted">Đang kiểm tra</span>
    ) : user ? (
      <span className="flex items-center gap-3">
        <span className="max-w-28 truncate" title={user.email}>{user.name}</span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="border-b border-black pb-1 hover:border-transparent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Đăng xuất
        </button>
      </span>
    ) : (
      <button
        type="button"
        onClick={() => signIn('/')}
        className="border-b border-black pb-1 hover:border-transparent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
      >
        Đăng nhập Google
      </button>
    )

  return (
    <header className="border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <a
          href="/"
          className="font-mono text-sm font-medium tracking-[0.18em] text-black uppercase outline-offset-4 focus-visible:outline-3 focus-visible:outline-black"
          aria-label="PlanRCM, về trang chủ"
        >
          Plan<span className="inline-block border border-black px-1.5 py-0.5">R</span>CM
        </a>

        <nav aria-label="Điều hướng chính" className="hidden md:ml-auto md:block">
          <ul className="font-mono flex flex-wrap items-center justify-end gap-x-5 gap-y-3 text-[10px] font-medium tracking-[0.14em] uppercase lg:gap-x-7">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="border-b border-transparent pb-1 transition-none hover:border-black focus-visible:border-black focus-visible:outline-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {user && (
              <li>
                <a
                  href="/plans"
                  className="border-b border-transparent pb-1 transition-none hover:border-black focus-visible:border-black focus-visible:outline-none"
                >
                  Plan của tôi
                </a>
              </li>
            )}
            <li className="border-l border-black pl-5 lg:pl-7">{authAction}</li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          className="font-mono min-h-11 min-w-11 border-2 border-black px-3 text-[10px] font-medium tracking-[0.12em] uppercase focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black md:hidden"
        >
          {isMenuOpen ? 'Đóng' : 'Menu'}
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" aria-label="Điều hướng chính" className="border-t-2 border-black md:hidden">
          <ul className="font-mono flex flex-col text-xs font-medium tracking-[0.12em] uppercase">
            {navigation.map((item) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-5 py-4 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-none sm:px-8"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {user && (
              <li className="border-b border-line">
                <a
                  href="/plans"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-5 py-4 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-none sm:px-8"
                >
                  Plan của tôi
                </a>
              </li>
            )}
            <li className="px-5 py-4 sm:px-8">{authAction}</li>
          </ul>
        </nav>
      )}
    </header>
  )
}
