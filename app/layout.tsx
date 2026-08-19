import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono, Nunito } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { AuthProvider } from '@/context/auth-context'
import { LocationProvider } from '@/context/location-context'
import { siteUrl } from '@/lib/site'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['600', '700', '800'],
})

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PlanRCM | Lập kế hoạch du lịch thông minh',
    template: '%s | PlanRCM',
  },
  description: 'Khám phá và biến mục tiêu chuyến đi thành lịch trình trải nghiệm tuyệt vời với trợ lý AI PlanRCM.',
  applicationName: 'PlanRCM',
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${nunito.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col selection:bg-[var(--color-moss)] selection:text-[var(--color-on-moss)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-[var(--color-moss)] focus:text-[var(--color-on-moss)] focus:rounded-full focus:shadow-lg"
        >
          Bỏ qua điều hướng
        </a>
        <AuthProvider>
          <LocationProvider>
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
