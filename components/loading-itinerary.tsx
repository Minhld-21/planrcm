'use client'

import { useEffect, useState } from 'react'

const loadingMessages = [
  'Đang phân tích tọa độ của bạn...',
  'Đang tìm kiếm các địa điểm ăn uống thú vị...',
  'Đang sắp xếp lộ trình di chuyển tối ưu...',
  'Sắp xong rồi, chờ một chút nhé...',
]

export function LoadingItinerary({ overlay = false }: { overlay?: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length)
    }, 2000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section
      className={`texture-grid grid min-h-80 place-items-center border-2 border-black bg-white px-6 py-10 text-center ${overlay ? 'absolute inset-0 z-10 min-h-0 bg-white/95' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md">
        <p className="font-mono text-[10px] font-medium tracking-[0.16em] uppercase">PlanRCM đang dựng hành trình</p>
        <p className="font-display mt-5 min-h-24 text-3xl leading-tight tracking-tight sm:text-4xl">
          {loadingMessages[messageIndex]}
        </p>
        <div className="mt-8 space-y-3" aria-hidden="true">
          <span className="block h-3 w-full animate-pulse bg-black/15" />
          <span className="block h-3 w-5/6 animate-pulse bg-black/15 [animation-delay:200ms]" />
          <span className="block h-3 w-2/3 animate-pulse bg-black/15 [animation-delay:400ms]" />
        </div>
      </div>
    </section>
  )
}
