import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { AuthProvider } from '@/context/auth-context'
import { LocationProvider } from '@/context/location-context'
import { siteUrl } from '@/lib/site'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="vi" className={jakarta.variable}>
      <body className="font-sans antialiased bg-[#F8FBFD] text-[#0F172A] min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-xl focus:shadow-lg"
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
