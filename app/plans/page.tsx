import type { Metadata } from 'next'
import { MyPlansWorkspace } from '@/components/my-plans-workspace'

export const metadata: Metadata = {
  title: 'Plan của tôi',
  description: 'Quản lý và chia sẻ các itinerary đã lưu trong tài khoản PlanRCM của bạn.',
  robots: { index: false, follow: false },
}

export default function PlansPage() {
  return (
    <main id="main-content" className="bg-[#F8FBFD] py-6 text-slate-900 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <MyPlansWorkspace />
      </div>
    </main>
  )
}
