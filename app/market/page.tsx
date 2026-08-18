import type { Metadata } from 'next'
import { MarketPlanFeed } from '@/components/market-plan-feed'
import { getMarketPlansForServer } from '@/lib/market-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Market Plan',
  description: 'Khám phá các itinerary du lịch được cộng đồng PlanRCM chia sẻ công khai.',
  alternates: { canonical: '/market' },
  openGraph: {
    title: 'Market Plan | PlanRCM',
    description: 'Khám phá các itinerary du lịch được cộng đồng PlanRCM chia sẻ công khai.',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default async function MarketPage() {
  const initialPlans = await getMarketPlansForServer()

  return (
    <main id="main-content" className="bg-[#F8FBFD] text-slate-900 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <MarketPlanFeed initialPlans={initialPlans} />
      </div>
    </main>
  )
}
