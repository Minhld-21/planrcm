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
      <span className="text-xs font-medium text-slate-400">Đang kiểm tra...</span>
    ) : user ? (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 border border-slate-200">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover border border-[#0052FF]/30"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-[10px] font-bold text-white shadow-sm">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="max-w-28 truncate text-xs font-semibold text-slate-800" title={user.email}>
            {user.name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => signIn('/')}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] px-4.5 py-2.5 text-xs font-bold text-white shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
      >
        <span>Đăng nhập Google</span>
        <span aria-hidden="true">↗</span>
      </button>
    )

  return (
    <header className="sticky top-0 z-40 travel-glass border-b border-slate-200/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-12">
        <a
          href="/"
          className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] focus-visible:ring-offset-2 rounded-xl"
          aria-label="PlanRCM, về trang chủ"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white font-bold text-lg shadow-accent group-hover:scale-105 transition-transform">
            🗺️
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Plan<span className="gradient-text">RCM</span>
          </span>
        </a>

        <nav aria-label="Điều hướng chính" className="hidden md:block">
          <ul className="flex items-center gap-1 text-xs font-semibold text-slate-600">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-xl px-3.5 py-2 hover:bg-slate-100/80 hover:text-[#0052FF] transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {user && (
              <li>
                <a
                  href="/plans"
                  className="rounded-xl bg-[#0052FF]/10 px-3.5 py-2 text-[#0052FF] hover:bg-[#0052FF]/15 transition-colors"
                >
                  Plan của tôi
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div className="hidden md:flex md:items-center md:gap-3">{authAction}</div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0052FF] md:hidden"
        >
          <span className="text-lg">{isMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" aria-label="Điều hướng chính" className="border-t border-slate-200 bg-white p-5 md:hidden">
          <ul className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 hover:bg-slate-100 hover:text-[#0052FF] transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {user && (
              <li>
                <a
                  href="/plans"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl bg-[#0052FF]/10 px-4 py-3 text-[#0052FF] hover:bg-[#0052FF]/15 transition-colors"
                >
                  Plan của tôi
                </a>
              </li>
            )}
            <li className="pt-3 border-t border-slate-100">{authAction}</li>
          </ul>
        </nav>
      )}
    </header>
  )
}
