'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'

const navigation = [
  { href: '/market', label: 'Market Plan' },
  { href: '/#phuong-phap', label: 'Cách PlanRCM làm việc' },
  { href: '/#tao-ke-hoach', label: 'Tạo hành trình' },
]

export function SiteHeader() {
  const { user, status, signIn, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const authAction =
    status === 'loading' ? (
      <span className="px-3 text-xs font-bold text-slate-500">Đang kiểm tra...</span>
    ) : user ? (
      <div className="flex items-center gap-2">
        <a
          href="/plans"
          className="flex min-h-11 items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-sky-700 transition-colors hover:bg-sky-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          title="Plan của tôi"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-7 w-7 rounded-full border border-sky-200 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-500 text-[11px] text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
        </a>
        <button
          type="button"
          onClick={() => void signOut()}
          className="organic-ghost hidden min-h-11 px-3 text-xs sm:inline-flex"
        >
          Đăng xuất
        </button>
      </div>
    ) : (
      <button type="button" onClick={() => signIn('/')} className="organic-primary min-h-11 px-4 text-xs">
        <span>Đăng nhập</span>
        <span aria-hidden="true">↗</span>
      </button>
    )

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-5">
      <div className="travel-glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-4">
        <a
          href="/"
          className="group flex min-h-11 min-w-0 items-center gap-2.5 rounded-full pr-2 outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
          aria-label="PlanRCM, về trang chủ"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-50 p-1.5 transition-transform duration-300 group-hover:scale-105">
            <img src="/brand/planrcm-logo-organic.png" width="1254" height="1254" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Plan<span className="text-sky-600">RCM</span>
          </span>
        </a>

        <nav aria-label="Điều hướng chính" className="hidden md:block">
          <ul className="flex items-center gap-1 text-xs font-extrabold text-slate-600">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3.5 transition-colors hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex md:items-center">{authAction}</div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition-colors hover:bg-sky-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] md:hidden"
          aria-label={isMenuOpen ? 'Đóng điều hướng' : 'Mở điều hướng'}
        >
          <span className="text-lg" aria-hidden="true">{isMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" aria-label="Điều hướng chính" className="travel-glass mx-auto mt-2 max-w-6xl rounded-[2rem] p-3 md:hidden">
          <ul className="flex flex-col gap-1 text-sm font-extrabold text-slate-700">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-12 items-center rounded-full px-4 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {user && (
              <li>
                <a href="/plans" onClick={() => setIsMenuOpen(false)} className="flex min-h-12 items-center rounded-full px-4 text-sky-700 hover:bg-sky-50">
                  Plan của tôi
                </a>
              </li>
            )}
            <li className="mt-2 border-t border-slate-200 px-1 pt-3">{authAction}</li>
          </ul>
        </nav>
      )}
    </header>
  )
}
