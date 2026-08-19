import type { Metadata } from 'next'
import { MarketPlanDetail } from '@/components/market-plan-detail'
import { getMarketPlanForServer } from '@/lib/market-server'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

const fallbackMetadata: Metadata = {
  title: 'Plan cộng đồng',
  description: 'Xem itinerary du lịch được chia sẻ trên Market Plan của PlanRCM.',
}

// oxlint-disable-next-line react(only-export-components) -- Next.js requires this route-level metadata export.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ planId: string }>
}): Promise<Metadata> {
  const { planId } = await params
  const plan = await getMarketPlanForServer(planId)

  if (!plan) {
    return fallbackMetadata
  }

  const description = `Lịch trình ${plan.destination} ${plan.totalDays} ngày được ${plan.author.name} chia sẻ trên PlanRCM.`

  return {
    title: `${plan.destination} · ${plan.totalDays} ngày`,
    description,
    alternates: { canonical: `${siteUrl}/market/${plan.id}` },
    openGraph: {
      title: `${plan.destination} · ${plan.totalDays} ngày | PlanRCM`,
      description,
      locale: 'vi_VN',
      type: 'article',
    },
  }
}

export default async function MarketPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const { planId } = await params
  const initialPlan = await getMarketPlanForServer(planId)

  return (
    <main id="main-content" className="organic-page py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <MarketPlanDetail planId={planId} initialPlan={initialPlan} />
      </div>
    </main>
  )
}
