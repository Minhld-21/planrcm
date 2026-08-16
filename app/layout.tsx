import type { Metadata } from 'next'
import { JetBrains_Mono, Playfair_Display, Source_Serif_4 } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { AuthProvider } from '@/context/auth-context'
import { LocationProvider } from '@/context/location-context'
import { siteUrl } from '@/lib/site'
import './globals.css'

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const body = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PlanRCM | Lập kế hoạch thông minh',
    template: '%s | PlanRCM',
  },
  description: 'Biến mục tiêu thành kế hoạch hành động rõ ràng với trợ lý AI PlanRCM.',
  applicationName: 'PlanRCM',
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <a
          href="#main-content"
          className="font-mono fixed top-3 left-3 z-50 -translate-y-20 border-2 border-black bg-black px-4 py-3 text-xs font-medium tracking-widest text-white uppercase transition-transform duration-100 focus:translate-y-0 focus-visible:translate-y-0"
        >
          Bỏ qua điều hướng
        </a>
        <AuthProvider>
          <LocationProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
