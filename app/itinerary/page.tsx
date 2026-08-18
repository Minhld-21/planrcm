import type { Metadata } from 'next'
import { ItineraryWorkspace } from '@/components/itinerary-workspace'

export const metadata: Metadata = {
  title: 'Lịch trình của bạn',
  description: 'Tạo và tinh chỉnh lịch trình du lịch cho điểm đến bạn chọn hoặc từ vị trí hiện tại.',
  robots: { index: false, follow: false },
}

export default function ItineraryPage() {
  return (
    <main id="main-content" className="bg-[#F8FBFD] py-6 text-slate-900 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <ItineraryWorkspace />
      </div>
    </main>
  )
}
