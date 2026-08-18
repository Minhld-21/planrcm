'use client'

import { useEffect, useState } from 'react'

const loadingMessages = [
  'Đang phân tích vị trí & địa hình...',
  'Đang tìm kiếm các điểm dừng ẩm thực & check-in tuyệt vời...',
  'Đang sắp xếp lộ trình di chuyển tối ưu nhất...',
  'Đang hoàn thiện lịch trình cho bạn, chờ một chút nhé...',
]

export function LoadingItinerary({ overlay = false }: { overlay?: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm flex flex-col items-center justify-center min-h-[320px] ${
        overlay ? 'absolute inset-0 z-20 bg-white/95 backdrop-blur-sm' : ''
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="relative mb-6">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent inline-block" />
          <span className="absolute inset-0 grid place-items-center text-lg">✈️</span>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
          PlanRCM AI đang khởi tạo
        </span>

        <p className="mt-3 min-h-[60px] text-lg font-bold text-slate-900 leading-snug sm:text-xl">
          {loadingMessages[messageIndex]}
        </p>

        <div className="mt-6 w-full space-y-2.5" aria-hidden="true">
          <span className="block h-3.5 w-full animate-pulse rounded-full bg-sky-100" />
          <span className="block h-3.5 w-4/5 animate-pulse rounded-full bg-slate-100 mx-auto" />
          <span className="block h-3.5 w-3/5 animate-pulse rounded-full bg-slate-100 mx-auto" />
        </div>
      </div>
    </section>
  )
}
